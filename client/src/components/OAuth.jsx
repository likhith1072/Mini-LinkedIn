import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai';
import { GoogleAuthProvider,getAuth,signInWithPopup } from 'firebase/auth';
import {app} from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth=getAuth(app);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    
    const handleGoogleClick =async()=>{
    const provider=new GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});
    try{
        const resultsFromGoogle=await signInWithPopup(auth,provider);
        const res=await fetch('/api/auth/google',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            
            body:JSON.stringify({name:resultsFromGoogle.user.displayName,
                email:resultsFromGoogle.user.email,
                googlePhotoUrl:resultsFromGoogle.user.photoURL,
            }),
            credentials: 'include', // IMPORTANT
        })
    const data=await res.json();
    if(res.ok){
      dispatch(signInSuccess(data));
      navigate('/');
    }
    } catch(error){
        console.log(error);
    }
        }
  return (
    <div>
        <div className='inline-block rounded-md bg-gradient-to-r from-pink-500 to-orange-500 p-[2px]'>
            <button type='button' className='flex w-70 box-border items-center gap-2 bg-white hover:bg-gradient-to-r from-pink-500 to-orange-500 p-2  rounded-md font-semibold dark:bg-gradient-to-r cursor-pointer hover:from-pink-600 hover:to-orange-600 ' onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2 '/>
        Continue with Google
      </button></div>
      
    </div>
  )
}
