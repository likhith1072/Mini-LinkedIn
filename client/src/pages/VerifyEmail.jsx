import React from 'react'
import {useRef,useEffect} from 'react'
import { signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


const VerifyEmail=()=> {
    const location=useLocation();
    const {email}=location.state || {};
   const navigate=useNavigate();
  const dispatch=useDispatch();
  const {currentUser}=useSelector(state=>state.user);
  const inputRefs=useRef([]);

  useEffect(() => {
   if(currentUser){
        navigate('/');
    }
    if(inputRefs.current[0]){
        inputRefs.current[0].focus();
    }
    
  },[]);
  

  const handleInput=(e,index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
        inputRefs.current[index+1].focus();  
    }
  }

  const handleKeyDown=(e,index)=>{
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRefs.current[index-1].focus();
    }
  }

  const handlePaste =(e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArray =paste.split('');
    pasteArray.forEach((item,index)=>{
        if(inputRefs.current[index]){
            inputRefs.current[index].value=item;
        }
    })
  }

  const handleClick =(index)=>{
    inputRefs.current[index].setSelectionRange(1,1);
  }

  const onSubmitHandler=async(e)=>{
    try {
        e.preventDefault();
        dispatch(signInStart());
        const otpArrray =inputRefs.current.map(e=>e.value)
        const otp=otpArrray.join('');
        if(isNaN(otp)){
          return toast.error('Please enter a valid OTP.');
        }
        const res=await fetch('/api/auth/verify-account',{method:'POST',
            headers:{
              'Content-Type':
              'application/json',
            },
            credentials: 'include', 
            body:JSON.stringify({otp,email}),
          });
        const data=await res.json();
        if(data.success== false){
            dispatch(signInFailure(data.message));
            return toast.error(data.message);
        }
        if(res.ok){
            dispatch(signInSuccess(data));
            navigate('/');
        }
    } catch (error) {
        toast.error(data.message);
        dispatch(signInFailure(error.message));
    }
  }

  return (
    <>
    <div className='min-h-screen fixed top-0 left-0 right-0 bottom-0 bg-gray-200/40 flex justify-center items-center dark:bg-gray-500/40'>
       <form onSubmit={onSubmitHandler} className='p-8 rounded-lg shadow-lg w-96 text-sm bg-gray-100 dark:bg-gray-800 dark:text-gray-300'>
        <h1 className=' text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='mb-2'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-3 ' onPaste={handlePaste}>{Array(6).fill(0).map((_,index)=>(
            <input key={index} type="text" maxLength='1' required className='w-10 h-10 border-1 text-center text-xl rounded-md m-1'
            ref={(e)=>{inputRefs.current[index]=e}} onInput={(e)=>{handleInput(e,index)}} 
            onKeyDown={(e)=>{handleKeyDown(e,index)}} onClick={()=>handleClick(index)}/>
        ))}</div>
        <button className='w-full py-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-md hover:from-blue-400 hover:to-blue-500  font-semibold mt-1 cursor-pointer dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800  ' type='submit'>Verify email</button>
       </form>
    </div>
    <div className='min-h-screen'>
    </div>
    </>
  )
}

export default VerifyEmail;
