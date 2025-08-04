import React, { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CustomEditor from "../components/CustomEditor"; // Import Lexical Editor
import {useNavigate} from 'react-router-dom';
import { useSelector } from "react-redux";

export default function CreatePost({setCreatePostOpen}) {
  const {currentUser} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [postError, setPostError] = useState(null);

  const navigate=useNavigate();


  // Handle Lexical Editor content change
  const handleEditorChange = (editorState) => {
    setFormData({ ...formData, content: JSON.stringify(editorState) });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(formData.content);
    try{
      const res=await fetch("/api/post/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      credentials:"include",
      body:JSON.stringify(formData),
    });
    const data=await res.json();
    if(!res.ok){
      setPostError(data.message);
      return;
    }
    if(res.ok)
    {setPostError(null);
    navigate(`/profile/${currentUser._id}?tab=posts`);
    }
  }
   catch(error) {
    setPostError('Something went wrong');
  }
};

  return (
    <div className="p-3 w-full mx-auto h-full">
      <h1 className="text-center text-2xl font-semibold ">Create Post</h1>
      <form className="flex flex-col gap-4 h-full" id='form' onSubmit={handleSubmit}>
   
        {/* Lexical Editor Section */}
        <div className="border  min-h-[200px]  bg-white shadow-sm dark:bg-gray-700 dark:rounded-md">
          <CustomEditor onChange={handleEditorChange} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer border rounded p-2 font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700  dark:hover:to-purple-800 text-grey-300"
          // onClick={()=> setCreatePostOpen(false)}
        >
          Post
        </button>

       {postError && <div className="bg-red-200 text-red-400 p-1">{postError} </div>}

      </form>
    </div>
  );
}
