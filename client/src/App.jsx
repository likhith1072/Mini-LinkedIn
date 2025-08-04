import React from 'react'
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer} from 'react-toastify'
import ResetPassword from './pages/ResetPassword'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'


function App() {
  return (
    <BrowserRouter>
      <ToastContainer />    
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />         
        {/* <Route path="/search" element={<Search />} /> */} 
        <Route path="/profile/:userId" element={<Profile />} />
       
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
