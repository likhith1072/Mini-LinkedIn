import express from 'express';
import {verifyToken} from '../utils/verifyUser.js';
import { create } from '../controllers/post.controller.js';
import { getposts } from '../controllers/post.controller.js';
import { deletepost } from '../controllers/post.controller.js';

import { getuserposts,likepost } from '../controllers/post.controller.js';

const router =express.Router();

router.post('/create',verifyToken,create);
router.get('/getuserposts/:userId',getuserposts);
router.get('/getposts',getposts);
router.put('/likepost/:postId',verifyToken,likepost);
router.delete('/deletepost/:postId/:userId',verifyToken,deletepost);


export default router;