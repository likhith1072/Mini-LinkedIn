import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

export const signup=async (req,res,next)=>{
   const {username,email,password}=req.body;

   if(!username || !email || !password || username==="" || email==="" || password ===""  ){
   return next (errorHandler(400,"All fields are required"));
  }
  
  try{
      const existingUser =await User.findOne({email});
      if(existingUser && existingUser.isAccountVerified){
        return next(errorHandler(409,"User already exists"));
      }
      if(existingUser && !existingUser.isAccountVerified){
        return res.json({success:true,message:"User created but Account is not verified please verify your account with email otp"});
      }

      const hashedPassword =bcryptjs.hashSync(password,5);
     const newUser =new User({
      username,
      email,
      password:hashedPassword,
      });
      await newUser.save();

  

    res.json({success:true,message:"User created successfully"});  

    const mailOptions={
      from:process.env.SENDER_EMAIL,
      to:email,
      subject:"Welcome to LinkNest",
      text:`Hello ${username},\n\nWelcome to LinkNest website.Your account has been created with email id: ${email}.`
    }

    await transporter.sendMail(mailOptions);
  } catch(error){
   next(error);
  }
};

export const signin=async (req,res,next)=>{
    const{email,password}=req.body;
    if(!email || !password || email==="" || password ===""  ){
       return next (errorHandler(400,"All fields are required"));
      } 
    try{
        const validUser =await User.findOne({email});
        if(!validUser){
         return next(errorHandler(404,"User not found"));
        }
       
        const validPassword =bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
          return next(errorHandler(400,"Invalid password"));
        }

        if(!validUser.isAccountVerified){
          return res.json({success:"verify",message:"Account is not verified please verify your account with email otp to signIn"});
        }

        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        
        const {password:pass,...rest}=validUser._doc;
        
        res.status(200).cookie('access_token',token,{
          httpOnly:true,
        //    secure: false, // true if using HTTPS
        //   sameSite: 'lax',path:'/',
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' && 'none',
        maxAge: 24 * 60 * 60 * 1000,
        }).json(rest);    
      }
      catch(error){
        next(error);
      } 
};


export const google=async (req,res,next)=>{
    const {name,email,googlePhotoUrl}=req.body;
    try{
       const user=await User.findOne({email});
        if(user){
          const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
          const {password:pass,...rest}=user._doc;
          res.cookie('access_token',token,{//modified
            httpOnly:true,
          //   secure: process.env.NODE_ENV === 'production', // true if using HTTPS
          //   sameSite: 'lax',
          // path:'/',
        }).status(200).json(rest); 
        }
        else{
          let generatedPassword="";
          while(generatedPassword.length<8){
            generatedPassword +=Math.random().toString(36).slice(-1);
          }
          // const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const hashedPassword =bcryptjs.hashSync(generatedPassword,5);
          let userNum="";
          while(userNum.length<4){
            userNum +=Math.random().toString(9).slice(-1);
          }
            
          const newUser =new User({
            username:name.toLowerCase().split(" ").join("")+userNum ,
            email,
            password:hashedPassword,
            profilePicture:googlePhotoUrl,
           });

          await newUser.save();
          const token=jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
          const {password:pass,...rest}=newUser._doc;
          res.status(200).cookie('access_token',token,{
            httpOnly:true}).json(rest);

            const mailOptions={
              from:process.env.SENDER_EMAIL,
              to:newUser.email,
              subject:"Welcome to LinkNest",
              text:`Hello ${newUser.username},\n\nWelcome to LinkNest website.Your account has been created with email id: ${email}.`
            }
        
            await transporter.sendMail(mailOptions);
        }
    } catch(error){
      next(error);
    }

}

//send verification otp to the user's email
export const sendVerifyOtp =async (req,res,next)=>{
  try {
    const {email}=req.body;
    
    const user=await User.findOne({email});
    if(user.isAccountVerified){
      return res.json({success:false,message:"Account already verified"});
    }

    const otp=String(Math.floor(100000 + Math.random()*900000));

    user.verifyOtp=otp;
    user.verifyOtpExpiryAt=Date.now()+60*60*1000;
    
    await user.save();

    const mailOptions={
      from:process.env.SENDER_EMAIL,
      to:user.email,
      subject:"Account Verification OTP",
      text:`Your OTP for account verification is ${otp}. It is valid for 1 hour.`
    }

    await transporter.sendMail(mailOptions);
    res.json({success:true,message:"OTP send to your email  successfully"});
  } catch (error) {
    next(error);
  }
}

export const verifyEmail =async (req,res,next)=>{
   const {otp,email}=req.body;
   if(!email || !otp){
    return res.json({success:false,message:"Missing Details"});
   }
   try {
    const user =await User.findOne({email});

    if(!user){
      return res.json({success:false,message:"User not found"});
    }
    if(user.verifyOtp === '' || user.verifyOtp !== otp){
      return res.json({success:false,message:"Invalid OTP"});
    }
    if(user.verifyOtpExpiryAt < Date.now()){
      return res.json({success:false,message:"OTP expired"});
    }

    user.isAccountVerified=true;
    user.verifyOtp='';
    user.verifyOtpExpiryAt=0;
    await user.save();
   

    const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
    const {password:pass,...rest}=user._doc;
      
      res.status(200).cookie('access_token',token,{
        httpOnly:true,
      //    secure: false, // true if using HTTPS
      //   sameSite: 'lax',path:'/',
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' && 'none',
      maxAge: 24 * 60 * 60 * 1000,
      }).json(rest);    


   } catch (error) {
    next(error);
   }
}

export const sendResetOtp =async (req,res,next)=>{
  const {email}=req.body;
  if(!email){
  return res.json({success:false,message:"Email is required"});
  }
  try{
    const user=await User.findOne({email});
    if(!user){
      return res.json({success:false,message:"User not found"});
    }
     
    const otp=String(Math.floor(100000 + Math.random()*900000));

    user.verifyOtp=otp;
    user.verifyOtpExpiryAt=Date.now()+60*60*1000;
    
    await user.save();

    const mailOptions={
      from:process.env.SENDER_EMAIL,
      to:user.email,
      subject:"Password Reset OTP",
      text:`Your OTP for resetting your password is ${otp}. It is valid for 1 hour.`
    }

    await transporter.sendMail(mailOptions);
    res.json({success:true,message:"OTP send to your email successfully"});

  } catch (error){
    next(error);
  }
}

//Reset User Password
export const resetPassword =async (req,res,next)=>{
  const {email,otp,newPassword}=req.body;

  if(!email || !otp || !newPassword){
    return res.json({success:false,message:"Email, OTP and new password are required"});
  }

  try {
    
    const user=await User.findOne({email});
    if(!user){
      return res.json({success:false,message:"User not found"});
    }

  if(user.verifyOtp === '' || user.verifyOtp !== otp){
    return res.json({success:false,message:"Invalid OTP"});
  }
  
  if(user.verifyOtpExpiryAt < Date.now()){
  
    return res.json({success:false,message:"OTP expired"});
  }

  const hashedPassword =bcryptjs.hashSync(newPassword,5);
  user.password=hashedPassword;
  user.verifyOtp='';
  user.verifyOtpExpiryAt=0;
  user.isAccountVerified=true;

  await user.save();
  
  return res.json({success:true,message:"Password reset successfully"});

  } catch (error) {
    next(error);
  }
}