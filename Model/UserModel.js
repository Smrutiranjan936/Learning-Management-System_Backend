const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female','others']
    },
    role:{
        type:String,
        required:true,
        enum:['admin','user'],
        default:'user'
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:'inactive'
    },
    profilePic: { 
        type: String,
        required: true,
        default: null
    }

})
const UserModel=mongoose.model('user',UserSchema);
module.exports=UserModel;