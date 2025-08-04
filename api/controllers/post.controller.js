import { errorHandler } from '../utils/error.js'
import Post from '../models/post.model.js';

export const create = async(req,res,next) => {
 
    if(!req.body.content){
        return next(errorHandler(400,'Please provide all required fields'))
    }
    
    const newPost =new Post({
      content:req.body.content,
      userId:req.user.id,
    });
    try{
        const savedPost=await newPost.save();
        res.status(201).json(savedPost);
    } catch(error){
        next(error);
    }
};


export const getposts = async(req,res,next) => {
    try{
      const startIndex=parseInt(req.query.startIndex) || 0;
      const limit=parseInt(req.query.limit) || 15;
      const posts=await Post.find({}).sort({updatedAt:-1}).skip(startIndex).limit(limit);

//       const posts = await Post.aggregate([
//   {
//     $addFields: {
//       sortScore: {
//         $add: [
//           { $multiply: [{ $toLong: "$updatedAt" }, 0.4] },
//           { $multiply: ["$noOfLikes", 0.6] },
//         ]
//       }
//     }
//   },
//   { $sort: { sortScore: 1 } },
//   { $skip: startIndex },
//   { $limit: limit }
// ]);

     res.status(200).json(posts)

    } catch(error){
        next(error);
    }
}

export const getuserposts = async(req,res,next) => {
    try{
        const userId = req.params.userId;
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 15;
        const posts = await Post.find({ userId }).sort({updatedAt:-1}).skip(startIndex).limit(limit);
        res.status(200).json(posts);
    } catch(error){
        next(error);
    }
}


export const deletepost = async(req,res,next) => {
  
    try{
        const post=await Post.findById(req.params.postId);       
    
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
          }
          if(req.user.id !== req.params.userId || req.user.id !== post.userId){
            return next(errorHandler(403,'You are not allowed to delete this post'));
        }
    } catch(error){
        return next(errorHandler(404,'Post not found'));
    }
    
    try{
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({message:'Post deleted successfully'});
    } catch(error){
        next(error);
    }
}



export const likepost=async(req,res,next)=>{
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, "Post not found"));
        }
        const userIndex= post.likes.indexOf(req.user.id);
        if(userIndex===-1){
        post.numberOfLikes+=1;
        post.likes.push(req.user.id);
        }
        else{
        post.numberOfLikes-=1;
        post.likes.splice(userIndex,1);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}