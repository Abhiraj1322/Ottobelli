import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { useEffect } from 'react'
import LandingPage from './Pages/LandingPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import EverydayPage from './Pages/EverydayPage'
import ClassicsPage from './Pages/ClassicsPage'
import {BrowserRouter,Routes,Route} from'react-router-dom'
import { Outlet } from "react-router-dom";
import useAuthStore from '../src/store/userAuthStore'
//layout
import Navbar from "./components/layout/Navbar";
function App() {
  const [count, setCount] = useState(0)
const{checkAuth}=useAuthStore()

  // On every page load/refresh — check if user is still logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const NavbarLayout = () => {
  return (
    <>
      <Navbar /> {/* Navbar only lives inside this wrapper! */}
      <Outlet/> {/* This is where the pages will load */}
    </>
  );
};


  return (
 <BrowserRouter>
 <Routes>
<Route path='/' element={<LandingPage/>}/>
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
 <Route element={<NavbarLayout />}>

<Route path='/everyday' element={<EverydayPage/>}/>
<Route path='/classics' element={<ClassicsPage/>}/>

 </Route>
 </Routes>
 
 
 </BrowserRouter>

 
  )
}

export default App
