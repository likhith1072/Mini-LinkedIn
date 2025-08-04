import React from 'react'
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { FaHome } from 'react-icons/fa';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;


    useEffect(() => {

    }, []);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div className='sticky top-0 z-50 bg-white'>
        <div className='relative' >
            <div className='sm:px-1 border-1 border-gray-500 flex justify-between items-center py-1 '>
                <div>
                    <Link to="/" className='self-center whitespace-nowrap text-md sm:text-xl font-semibold'>
                    <div className='flex items-center justify-center h-15 w-23'><img src="/LinkNestLogo.png" alt="Logo" className='w-full h-full object-fill rounded-lg ' /></div>
                        
                    </Link>
                </div>

                <div className='w-full py-2' >
                    <div className=" px-4 sm:px-6 lg:px-8 flex  lg:justify-between justify-content items-center bg-green w-full">

                        {/* Desktop Links */}
                        <div className="flex space-x-7 w-full lg:text-xl justify-center items-center">
                            <Link to="/" className={`${isActive('/') ? "text-blue-500": "text-gray-600"} cursor-pointer  p-1`}><FaHome size={24} /></Link>

                        </div>


                        <div className='flex gap-2 items-center justify-center'>

                            {currentUser ? (<div className=' relative group px-2 w-14' >
                                <img src={currentUser.profilePicture} alt="user" referrerPolicy="no-referrer" className='rounded-full w-10 h-10 cursor-pointer ' onClick={() => navigate(`/profile/${currentUser._id}`)} />

                                <div className='absolute top-10 right-0 border-1 
                            bg-white dark:bg-gray-800 dark:text-gray-400 rounded-md flex-col items-center justify-center hidden group-hover:flex p-2 z-1'>
                                    <div className='py-1'>{currentUser.username}</div>
                                    <div className='py-1'>{currentUser.email}</div>
                                    <Link to={`/profile/${currentUser._id}`} className='dark:hover:bg-gray-600 hover:bg-gray-300 w-full text-center py-1'>Profile</Link>
                                  
                                    <div className='dark:hover:bg-gray-600 hover:bg-gray-300 w-full text-center py-1 cursor-pointer' onClick={handleSignout}><Link to="/signin">Sign out</Link></div>
                                </div>

                            </div>) : (<Link to='/signin' className={`${isActive('/signin') && "hidden"}`}>
                                <div className=' h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold cursor-pointer flex justify-center items-center'>Sign In</div></Link>)
                            }

                        </div>


                    </div>


                </div>

            </div>
        </div>
        </div>
    )
}

