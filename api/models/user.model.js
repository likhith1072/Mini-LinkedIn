import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    verifyOtp:{
        type:String,
        default: "",
    },
    verifyOtpExpireAt:{
        type:Number,
        default: 0,
    },
    isAccountVerified:{
        type:Boolean,
        default: false,
    },
    followers:{
        type:Array,
        default:[],
    },
    following:{
        type:Array,
        default:[],
    },
  },{timestamps:true}
);

const User=mongoose.models.User || mongoose.model('User',userSchema);
export default User;