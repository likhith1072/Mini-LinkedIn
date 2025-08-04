import express from 'express';
import {signup,signin,google,sendVerifyOtp,verifyEmail,sendResetOtp,resetPassword} from '../controllers/auth.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router=express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.post('/send-verify-otp',sendVerifyOtp);
router.post('/verify-account',verifyEmail);
router.post('/send-reset-otp',sendResetOtp);
router.post('/reset-password',resetPassword);


export default router;