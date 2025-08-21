const UserModel = require("../Model/UserModel");
const CategoryModel = require("../Model/AddCategoryModel");
const SubjectModel = require('../Model/SubjectModel');
const ChapterModel = require('../Model/ChapterModel');
const Payment = require('../Model/Payment');
const crypt = require("bcrypt");

// Register Controller
exports.register = async (req, res) => {
  try {
    const body = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.password ||
      !body.dob ||
      !body.gender ||
      !body.phone ||
      !body.address
    ) {
      return res.json({ message: "All Fields are Required" });
    }

    // ✅ Save only the unique filename (multer generated one)
    let profilePic = req.file ? req.file.filename : null;

    // Hash password
    const hashedPassword = await crypt.hash(body.password, 10);

    // Create new user
    const newUser = await UserModel.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      dob: body.dob,
      gender: body.gender,
      address: body.address,
      phone: body.phone,
      profilePic, // ✅ only unique name gets stored
    });

    if (newUser) {
      return res.json({ message: "User Created Successfully" });
    } else {
      return res.json({ message: "Something Went Wrong" });
    }
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};



exports.login = async (req, res) => {
  const body = req.body;
  if (!body || !body.email || !body.password) {
    return res.json({ message: "email and password is required" });
  } else {
    const user = await UserModel.findOne({ email: body.email });
    if (!user) {
      return res.json({ message: "invalid Credentials" });
    } else {
      const isMatch = await crypt.compare(body.password, user.password);
      if (!isMatch) {
        return res.json({ message: "invalid password" });
      } else {
        return res.json({
          message: "logged in successfully",
          role: user.role,
          name: user.name,
          id: user._id,
          email: user.email,
          profilePic: user.profilePic
        });
      }
    }
  }
};

exports.addCategory = async (req, res) => {
  await CategoryModel.create({
    categoryName: req.body.categoryName,
  });
  return res.json({ message: "Category Created. " });
};

exports.fetchCategory = async (req, res) => {
  let category = await CategoryModel.find();
  return res.json(category);
};

exports.singleCategory = async (req, res) => {
  const id = req.params.id;
  let category = await CategoryModel.findById(id);
  return res.json(category);
};

exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  const body = req.params.body;
  const uc = await CategoryModel.findByIdAndUpdate(id, {
    categoryName: req.body.categoryName,
  });
  return res.json({ message: "Category Updated. " });
};

exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  await CategoryModel.findByIdAndDelete(id);
  return res.json({ message: "Category Deleted. " });
};

exports.addSubject = async (req, res) => {
  try {
    const { subjectName, price, description, trainer, category } = req.body;
    const thumbnail = req.file ? req.file.filename : null;
    if (!subjectName || !price || !description || !trainer || !category || !thumbnail) {
      return res.status(400).json({ message: "All Fields are Required, including an image." });
    }
    const newSubject = new SubjectModel({
      subjectName,
      price,
      description,
      thumbnail,
      trainer,
      trainer,
      category: JSON.parse(category)

    });

    const saved = await newSubject.save();
    res.status(202).json({ message: "Subject added successfully", data: saved });
  } catch (error) {
    res.status(201).json({ message: "Server error", error: error.message });
  }
}

exports.fetchSubject = async (req, res) => {
  const subjects = await SubjectModel.find();
  return res.json(subjects);
}

exports.updateSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const { subjectName, price, description, trainer } = req.body;
    const thumbnail = req.file ? req.file.filename : null; // if you handle image update too

    const updateData = {
      subjectName,
      price,
      description,
      trainer
    };

    if (thumbnail) {
      updateData.thumbnail = thumbnail; // only overwrite if new image uploaded
    }

    const updatedSubject = await SubjectModel.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.json({ message: "Subject updated", data: updatedSubject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await SubjectModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.json({ message: "Subject deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.singleSubject = async (req, res) => {
  const id = req.params.id;
  const subject = await SubjectModel.findById(id);
  if (!subject) {
    return res.status(404).json({ message: "Subject not found" });
  }
  return res.json(subject);
};


exports.addChapter = async (req, res) => {
  try {
    const { ChapterName, ChapterDescription, SubjectId } = req.body;
    const ChapterThumbnail = req.files["ChapterThumbnail"]
      ? req.files["ChapterThumbnail"][0].filename
      : null;
    const ChapterVideo = req.files["ChapterVideo"]
      ? req.files["ChapterVideo"][0].filename
      : null;
    if (!ChapterThumbnail || !ChapterVideo) {
      return res.status(400).json({ message: "File upload failed." });
    }
    const newChapter = new ChapterModel({
      ChapterName,
      ChapterDescription,
      SubjectId,
      ChapterThumbnail,
      ChapterVideo,
    });
    await newChapter.save();
    res.status(201).json({ message: "Chapter added successfully." });
  } catch (err) {
    console.error("Error saving chapter:", err);
    res.status(500).json({ message: "Server error while adding chapter." });
  }
}

exports.fetchChapter = async (req, res) => {
  const id = req.params.id;
  const chapters = await ChapterModel.find({ SubjectId: id });
  return res.json(chapters);
}
exports.deleteChapter = async (req, res) => {
  const id = req.params.id;
  const deleted = await ChapterModel.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Chapter not found" });
  }
  return res.json({ message: "Chapter deleted" });
};

exports.addPayment = async (req, res) => {
  try {
    const { userId, subjectId, price, utrNumber } = req.body;
    const payment = new Payment({
      userId,
      subjectId,
      price,
      utrNumber
    });
    await payment.save();
    res.json({ success: true, message: 'Payment submitted for verification', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

exports.showVideos = async (req, res) => {
  const { subjectId, userId } = req.params;
  const payment = await Payment.findOne({
    userId,
    subjectId
  });
  if (!payment) {
    return res.json({ message: 'Access denied. Please purchase the subject.' });
  }
  if (payment.status !== 'verified') {
    return res.json({ message: 'Payment not verified yet.' });
  }
  if (payment.status === 'rejected') {
    return res.json({ message: 'Payment rejected. Please contact support.' });
  }
  if (payment.status === 'pending') {
    return res.json({ message: 'Payment is still pending verification.' });
  }
  if (payment.status === 'verified') {
    return res.json({ message: 'verified' });
  }
}

exports.fetchPurchaseVideo = async (req, res) => {
  const { subjectId, userId } = req.params;
  const payment = await Payment.findOne({
    userId,
    subjectId
  });
  if (!payment) {
    return res.json({ message: 'notpurchased' });
  }
  if (payment.status === 'pending') {
    return res.json({ message: 'pending' });
  }
  if (payment.status === 'verified') {
    return res.json({ message: 'verified' });
  }
}

exports.approvePayment = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('subjectId', 'subjectName') // matches SubjectModel fields
      .populate('userId', 'name'); // matches UserModel fields

    if (payments.length === 0) {
      return res.json({ message: 'No pending payments to approve.' });
    }

    return res.json(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.approvePaymentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true })
      .populate('subjectId', 'subjectName')
      .populate('userId', 'name');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.json({ message: `Payment ${status} successfully`, payment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.watchVideo = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const chapters = await ChapterModel.find({ SubjectId: subjectId });
    if (chapters.length === 0) {
      return res.status(404).json({ message: 'No chapters found for this subject.' });
    }
    return res.json(chapters);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching chapters.' });
  }
};
exports.purchasedVideos = async (req, res) => {
  const userId = req.params.userId;
  try {
    const payments = await Payment.find({ userId, status: 'verified' })
      .populate('subjectId', 'subjectName thumbnail price'); // Populate subject details

    if (payments.length === 0) {
      return res.json({ message: 'No purchased videos found.' });
    }

    return res.json(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching purchased videos.' });
  }
};



// const SubjectModel = require("../models/SubjectModel");

// Delete subject by ID
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const deleted = await SubjectModel.findByIdAndDelete(subjectId);

    if (!deleted) return res.status(404).json({ message: "Subject not found for deletion" });

    return res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete subject", error });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    await SubjectModel.findByIdAndUpdate(id, updateData, { new: true });
    return res.json({ message: "Subject Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update subject", error });
  }
};
