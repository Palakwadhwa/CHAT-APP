// import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Routes,Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import ProfilePage from './pages/ProfilePage'
import useAuthhook from './hooks/useAuthhook'
import { useEffect } from 'react'
import {LoaderPinwheel} from 'lucide-react'
import {Toaster} from "react-hot-toast"
import { useState } from "react";


function App() {

  const {authUser, checkauth , isCheckingAuth , onlineUsers } = useAuthhook();

  
  useEffect(()=>{  //it will gets trigger as soon as page loads
    checkauth();
  },[checkauth])
  
  console.log(onlineUsers)
  
  console.log(authUser)

  if(isCheckingAuth && !authUser) return(
     <div className="flex items-center justify-center h-screen">
        <LoaderPinwheel className="size-10 animate-spin" />
      </div>
  )


  return (
  <div>
    {/* <h1 className='bg-amber-300'>Hello Tailwind CSS</h1> */}
    <Navbar/>
    <Routes>
      
      <Route path='/' element={authUser ? <HomePage /> : < Navigate to = '/login/' />} /> 
      <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to = '/' />    }  />
      <Route path='/login' element={!authUser? <LogInPage /> : <Navigate to = '/' /> } />
      <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to = '/login/' />} />

    </Routes>

    <Toaster/>

  </div>
  )
}

export default App
