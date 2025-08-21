const express=require('express');
const router=express.Router();
const UserController=require('../Controller/myController');
const upload=require('../middleware/upload');
const chapters=require('../middleware/uploadchapter');
const uploadProfile = require('../middleware/profileUpload');
router.post('/register',uploadProfile.single('profilePic'),UserController.register);
router.post('/login',UserController.login);
router.post('/addCategory',UserController.addCategory);
router.get('/fetchCategory',UserController.fetchCategory);
router.get('/singleCategory/:id',UserController.singleCategory);
router.put('/updateCategory/:id',UserController.updateCategory);
router.delete('/deleteCategory/:id',UserController.deleteCategory);

router.post('/addSubject',upload.single('thumbnail'),UserController.addSubject);
router.get('/fetchSubjects',UserController.fetchSubject);
router.put('/updateSubject/:id', UserController.updateSubject);
router.delete('/deleteSubject/:id', UserController.deleteSubject);
router.get('/singleSubject/:id', UserController.singleSubject)

router.post('/addChapter',chapters.fields([
    { name: "ChapterThumbnail", maxCount: 1 },
    { name: "ChapterVideo", maxCount: 1 },
  ]),UserController.addChapter);
router.get('/fetchChapter/:id',UserController.fetchChapter);
router.delete('/deleteChapter/:id', UserController.deleteChapter);

router.post('/addPayment', UserController.addPayment);
router.get('/showVideos/:subjectId/:userId', UserController.showVideos);
router.get('/fetchPurchaseVideo/:subjectId/:userId', UserController.fetchPurchaseVideo);
router.get('/approvePayment',UserController.approvePayment);
router.put('/approvePayment/:id', UserController.approvePaymentStatus);
router.get('/watchVideo/:subjectId', UserController.watchVideo);
router.get('/purchasedVideos/:userId', UserController.purchasedVideos);
module.exports=router