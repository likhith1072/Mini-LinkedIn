import React, { useEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux';
import { useState ,useRef} from 'react';
import {getStorage, uploadBytesResumable,ref,getDownloadURL} from 'firebase/storage';
import {app} from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice.js';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import { deleteStart,deleteSuccess,deleteFailure } from '../redux/user/userSlice.js';
import { signoutSuccess } from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Post from '../components/Post.jsx';


function Profile()  {
  const { userId } = useParams();

  const {currentUser,error,loading}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(0);
  const [imageFileUploadError,setImageFileUploadError]=useState(null);
  const [imageFileUploading,setImageFileUploading]=useState(false); 
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
  const [updateUserError,setUpdateUserError]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [formData,setFormData]=useState({});  
  const filePickerRef=useRef();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

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
        setUserPosts((prev)=>prev.filter((post)=>post._id !== postIdToDelete));
      }
     } catch (error) {
      console.log(error.message);
     }
  };


  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile]);

  const uploadImage=async()=>{
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage=getStorage(app);
    const fileName =new Date().getTime()+imageFile.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL=>{
           setImageFileUrl(downloadURL);
           setFormData({...formData,profilePicture:downloadURL});
            setImageFileUploading(false);
        }
      );
      },
    );
  };

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes were made');
      return;
    }
    if(imageFileUploading){
      return;
    }
    try {
      dispatch(updateStart());
      // console.log({currentUser,formData});
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if(!res.ok){
       dispatch(updateFailure(data.message));
       setUpdateUserError(data.message);
      }
      else{
        dispatch(updateSuccess(data));
        setFormData({});
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }

  const handleDeleteUser=async()=>{
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      if(!res.ok){
       dispatch(deleteFailure(data.message));
       
      }
      else{
        dispatch(deleteSuccess(data));
      }
    }
   catch (error) {
    dispatch(deleteFailure(error.message));
  }
}
  
const handleSignout=async()=>{
  try {
    const res = await fetch('/api/user/signout',{
      method:'POST',
      credentials: 'include',
    });
    const data= await res.json();
    if(!res.ok){
      console.log(data.message);
    }
    else{
      dispatch(signoutSuccess());
    }
  } catch (error) {
    console.log(error.message);
  }
}

  useEffect(() => {
        fetchUser();
        fetchUserPosts();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        // Handle successful user fetching
        setUserData(data);
      } else {
        // Handle errors
        console.error("Error fetching user:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`/api/post/getuserposts/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        // Handle successful post fetching
        setUserPosts(data);
      } else {
        // Handle errors
        console.error("Error fetching user posts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }

  return (
    <div>
      {currentUser && currentUser._id === userId ? ( <div className='w-full max-w-lg mx-auto p-3 relative'>
       <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input type="file" accept='image/*' className='border-1 cursor-pointer p-1 hidden' onChange={handleImageChange} ref={filePickerRef} />
        <div className='w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full shadow-md relative' onClick={()=>{filePickerRef.current.click()}} >
           
           {imageFileUploadProgress &&  (<CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
           strokeWidth={5} 
           styles={{
            root:{
              width:'100%',
              height:'100%',
              position:'absolute',
              top:0,
              left:0,
            },
            path:{
              stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`
            },
           }}/> )}
          <img src={ imageFileUrl || currentUser.profilePicture} alt="user" className={`absolute top-0 left-0 rounded-full w-full h-full  object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}  />
        
          
        </div>
      
          {imageFileUploadError && <div>{imageFileUploadError}</div>}
          <p className='text-gray-700 text-center'>{currentUser?currentUser.email : 'Loading...'}</p>
        
        <input type="text" id="username" placeholder="username" defaultValue={currentUser.username} className='p-1 border-1 rounded-sm bg-gray-50 ' onChange={handleChange}/>
        <button className='bg-gradient-to-r from-purple-400 to-blue-400 hover:from bg-purple-500 hover:to-blue-500 cursor-pointer rounded-sm' type="submit" disabled={loading || imageFileUploading}>{loading ? 'Loading..' : 'Update'}</button>
        
       </form>
       <div className='text-red-500 flex justify-between mt-4 p-1'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
       </div>
       {updateUserSuccess && <div className='bg-green-100 text-green-400 rounded-sm p-2'>{updateUserSuccess}</div>
       }
       {updateUserError && <div className='bg-red-100 text-red-400 rounded-sm p-2'>{updateUserError}</div>
        }
        {error && <div className='bg-red-100 text-red-400 rounded-sm p-2'>{error}</div>}
       
        {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
          <div className='bg-white  p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
            <HiOutlineExclamationCircle className='text-gray-400  w-20 h-20'/>
            <div className='text-center text-xl'>Are you sure you want to delete your account?</div>
            <div className='flex justify-center gap-10 item-center w-full mt-5'> 
              <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={handleDeleteUser}>Yes,I'm sure</button>
            <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
           
          </div>
        </div>
        }
    </div>):(<div className='w-full max-w-lg mx-auto p-3 '>
      <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
      <div className='flex flex-col items-center gap-3'>
        <img src={userData?userData.profilePicture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="user" className='rounded-full w-32 h-32 object-cover border-8 border-[lightgray]' />
        <p className='text-xl font-semibold'>{userData?userData.username : 'Loading...'}</p>
        <p className='text-gray-500'>{userData?userData.email : 'Loading...'}</p>
      </div>
    </div>)}
   

    <div className='w-full max-w-lg mx-auto p-3 flex flex-col gap-2 '>
      <h2 className='text-2xl font-semibold text-center'>{currentUser && currentUser._id === userId ? 'Your Posts' : 'Posts'}</h2>
      
        {userPosts.map((post) => (
             <Post key={post._id} post={post} handleDeletePost={handleDeletePost}/>
          ))}
    </div>
        
    </div>
  )
}

export default Profile
