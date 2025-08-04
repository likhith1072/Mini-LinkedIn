import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';


export default function SignUp() {
  const dispatch=useDispatch();
  const [formData,setFormData]=useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleChange =(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  
  const handleSubmit =async (e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out all fields.');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':
          'application/json',
        },
        credentials: 'include', 
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      if(data.success== false){
        setLoading(false);
        toast.error(data.message);
        return setErrorMessage(data.message);
      }
      
      if(res.ok){
        const re=await fetch('/api/auth/send-verify-otp',{
          method:'POST',
          headers:{
            'Content-Type':
            'application/json',
          },
          credentials: 'include', 
          body:JSON.stringify({email:formData.email}),
        });
        const otpsend=await re.json();
        if(otpsend.success){
          setLoading(false);
          navigate('/verify-email', {
            state: { email: formData.email }
          });
        }
        else{
          setLoading(false);
          return setErrorMessage(otpsend.message);
        }
       
      }
    } catch(error){
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
    }

  }

  return (
    <div className='min-h-screen mt-20'>
      <div className=' flex p-3 max-w-6xl mx-auto flex-col md:flex-row gap-5 md:gap-40'>
       {/* left */}
               <div className='flex flex-col p-2 gap-2'>
                 <Link to="/" className='font-bold  w-23 h-15 ml-25 md:h-30 md:w-43'>
                  <div className='flex items-center justify-center h-15 w-23 md:h-30 md:w-43'><img src="/LinkNestLogo.png" alt="Logo" className='w-full h-full object-fill rounded-lg ' /></div>
                 </Link>
                 <p className='text-sm mt-5'>You can sign up with your email and password or with Google</p>
               </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-3'  onSubmit={handleSubmit}>
            <div className='flex flex-col'>
              <label htmlFor="username">Your username</label>
              <input type="text" placeholder='Username' id='username'  onChange={handleChange} className='border-1 w-70 h-8 bg-gray-100 rounded-sm px-2'/>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="email">Your Email</label>
              <input type="email" placeholder='Email' id='email' onChange={handleChange}  className='border-1 w-70 h-8 bg-gray-100 rounded-sm px-2'/>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="password">Your Password</label>
              <input type="password" placeholder='Password' id='password'  onChange={handleChange} className='border-1 w-70 h-8 bg-gray-100 rounded-sm px-2'/>
            </div>
            <Link to ='/reset-password' className='text-blue-500 hover:text-blue-700'>Forget Password?</Link>
            <div className='pl-25'>
              <button type='submit' className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-sm text-white w-20 h-8 cursor-pointer hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 ' disabled={loading}>
                {loading ? (<>
                <span className='pl-3'>Loading...</span></>):('Sign Up')}
              </button>
            </div>
            <OAuth/>
          </form>
          <div className='mt-3 flex gap-2 pl-13'>
            <span>Have an account?</span>
            <Link to ='/signin' className='text-blue-500 hover:text-blue-700'>Sign In</Link>
            </div>
            {/* {errorMessage && <div className='text-red-500  bg-red-100 flex justify-center items-center rounded-md w-70 mt-2 p-2'>{errorMessage}</div>} */}
        </div>
      </div>
    </div>
  )
}
