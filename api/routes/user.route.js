import express from 'express';
const router=express.Router();
import {updateUser,deleteUser,signout,getUser} from '../controllers/user.controller.js';
import {verifyToken} from '../utils/verifyUser.js';


router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signout);
router.get('/:userId',getUser)

export default router;