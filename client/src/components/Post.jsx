import React from 'react'
import { useState, useEffect } from 'react';
import {lexicalToHtml} from "./lexicalToHtml.js";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


function Post({ post, handleDeletePost }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
   const [modifiedPost,setModifiedPost] = useState(post);


   const [userData, setUserData] = useState(null);
   useEffect(() => {
      const contentData = typeof post.content === 'string'
         ? JSON.parse(post.content)
         : post.content;
      setModifiedPost({ ...post, content: contentData });
      console.log(contentData);

    fetchUser();
    
   }, [post]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/${post.userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

        const contentHtml =
      modifiedPost  && lexicalToHtml(modifiedPost.content); ;

      function timeAgo(timestamp) {
  const updatedDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now - updatedDate;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

    const handleLike =async(postId)=>{
      try {
       if(!currentUser){
         navigate('/sign-in');
         return;
       }
       const res=await fetch(`/api/post/likepost/${postId}`,{
         method:'PUT',
         credentials:'include', 
       });
       if(res.ok){
        const data=await res.json();
       
        setModifiedPost({
          ...modifiedPost,
          likes: data.likes,
          numberOfLikes: data.numberOfLikes,
        });
       }
      } catch (error) {
         console.log(error.message);
      }
    }

 

           
  return (
    <div className='border border-gray-300 rounded-lg p-4 bg-gray-100 hover:shadow-sm'>
        <div className='flex items-center justify-between '>
          <div className='flex gap-1 items-center justify-start  '>
             <div><img src={userData&&userData.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="user" referrerPolicy="no-referrer" className='rounded-full w-10 h-10 cursor-pointer ' onClick={() => navigate(`/profile/${modifiedPost.userId}?tab=profile`)} /></div>
          
            {userData?(<div><p className='text-md font-semibold'>{userData.username}</p>
            <p>{`${modifiedPost.updatedAt} (${timeAgo(modifiedPost.updatedAt)})`}</p>
            </div>):(<p></p>)}</div>

            <div>
              {currentUser && currentUser._id === modifiedPost.userId &&
              <button onClick={() =>setShowModal(true)} className='text-red-400 hover:text-red-600 cursor-pointer'>Delete</button>
              }
            </div>
         

        </div>

         <div className='mx-auto p-3  max-w-3xl w-full post-content' dangerouslySetInnerHTML={{__html:modifiedPost && contentHtml}}
          >
          </div>
        
        <div className='ml-4 flex gap-1'>
           <button type='button' onClick={()=>handleLike(modifiedPost._id)} className={`text-gray-400 hover:text-blue-500 cursor-pointer ${currentUser && modifiedPost.likes.includes(currentUser._id) && '!text-blue-500'} flex gap-1`}>
            <FaThumbsUp className='text-sm'/>
             <p className='text-gray-500 text-xs '>
            {
              modifiedPost.numberOfLikes >0 && modifiedPost.numberOfLikes + " "+ (modifiedPost.numberOfLikes === 1 ? "like" : "likes")
            }
          </p>
          </button>
         
        </div>
        {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
          <div className='bg-white  p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
            <HiOutlineExclamationCircle className='text-gray-400  w-20 h-20'/>
            <div className='text-center text-xl'>Are you sure you want to delete your account?</div>
            <div className='flex justify-center gap-10 item-center w-full mt-5'> 
              <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer hover:bg-red-600' onClick={() =>handleDeletePost(modifiedPost._id)}>Yes,I'm sure</button>
            <button className='bg-gray-100 text-black hover:bg-gray-200 rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
           
          </div>
        </div>
        }

    </div>
  )
}

export default Post
