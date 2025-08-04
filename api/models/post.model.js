import mongoose from 'mongoose';

const postSchema =new mongoose.Schema(
    {
      userId:{
        type:String,
        required:true,
      },
      content:{
        type:String,
        required:true,
      },
       likes:{
        type:Array,
        default:[],
    },
    numberOfLikes:{
        type:Number,
        default:0,
    },
    numberOfComments:{
      type:Number,
      default:0,
    }

    },{timestamps:true}
);

const Post=mongoose.model('Post',postSchema);

export default Post;