import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { X } from "lucide-react";
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { useEffect } from 'react';

function Home() {

  const {currentUser} = useSelector((state) => state.user);

  const  dispatch =useDispatch();
  const navigate = useNavigate();
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState([]);

useEffect(()=>{
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/post/getposts",{
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        // Handle successful post fetching
        setPosts(data);
        
        
      } else {
        // Handle errors
        console.error("Error fetching posts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchPosts();
},[])

    const handleDeletePost=async(postIdToDelete)=>{
    //  setShowModal(false);
     try {
      const res=await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method:'DELETE',
        credentials: 'include',
      });
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setPosts((prev)=>prev.filter((post)=>post._id !== postIdToDelete));
      }
     } catch (error) {
      console.log(error.message);
     }
  };

  return (
    <div className='min-h-screen mt-2 '>
      <div className=' flex max-w-[100%] sm:max-w-[80%] md:max-w-[65%] lg:max-w-[50%] mx-auto flex-col p-3 gap-5 border border-gray-200 rounded-lg min-h-screen'>
        {currentUser ? (<div className='flex gap-1 items-center lg:justify-center '>
          <img src={currentUser.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="user" referrerPolicy="no-referrer" className='rounded-full w-10 h-10 cursor-pointer ' onClick={() => navigate(`/profile/${currentUser._id}?tab=profile`)} />
          <button onClick={() => setCreatePostOpen(true) } className='w-full h-10 rounded-3xl bg-gray-200 lg:w-[75%] flex justify-start items-center cursor-pointer hover:border hover:border-gray-400'><p className='ml-5' >Create Post</p></button>
        </div>):(<div></div>)
        }

        <div className='flex flex-col gap-2'>
          {posts.map((post) => (
             <Post key={post._id} post={post} handleDeletePost={handleDeletePost}/>
          ))}
        </div>
        

      </div>

      {createPostOpen && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setCreatePostOpen(false)}>
          <div className='bg-white  rounded-md w-[90%] h-[80%] md:w-[80%] md:h-[80%] lg:w-[60%] lg:h-[80%] flex flex-col items-center 'onClick={(e)=>e.stopPropagation()}>
            <div className='flex justify-between items-center w-full'>
               <img src={currentUser.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="user" referrerPolicy="no-referrer" className='rounded-full w-10 h-10 cursor-pointer ml-4 ' onClick={() => navigate(`/profile/${currentUser._id}?tab=profile`)} />
              <X className='text-gray-600 w-10 h-10 cursor-pointer border bg-gray-300 hover:bg-gray-400 hover:text-gray-700' onClick={() => setCreatePostOpen(false)}/>
            </div>
            <div className=' h-full w-full'> 
              <CreatePost setCreatePostOpen={setCreatePostOpen} />
            </div>
           

           
          </div>
        </div>
        }
    </div>
  )
}

export default Home
