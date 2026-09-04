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
import ProtectedRoute from './components/protectedroute/ProtectedRoute'
import CartPage from './Pages/CartPage'
import FavoritesPage from './components/account/FavoritesPage'
import CategoryListingPage from './Pages/CategoryListingPage'
import ProductPage from './Pages/ProductPage'
//layout
import Navbar from "./components/layout/Navbar";
import ProfilesPage from './components/account/ProfilesPage'
import MeasurementsPage from './components/account/MeasurementsPage'
import AccountPage from './components/account/AccountPage'
import Footer from './components/layout/Footer'
import AdminBulkUpload from './components/account/AdminBulkupload'
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
      {/* main with flex-1 forces the footer to the bottom of short pages */}
      <main className="flex-1 flex flex-col bg-amber-50">
        <Outlet />
      </main>
      <Footer/>
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
 
 <Route path="/cart" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
 <Route path="/favorites" element={
          <ProtectedRoute><FavoritesPage /></ProtectedRoute>
        } />
 <Route path="/account/adminbulkupload" element={
          <AdminBulkUpload/>
        } />

 <Route path="/account/profiles" element={
          <ProtectedRoute><ProfilesPage /></ProtectedRoute>
        } />


         <Route path="/account/profiles/:id/measurements" element={
          <ProtectedRoute><MeasurementsPage /></ProtectedRoute>
        } />

        <Route path="/account" element={
          <ProtectedRoute><AccountPage /></ProtectedRoute>
        } />


 {/* ── Category + Product Routes ── */}
        <Route path="/classics/:categorySlug" element={<CategoryListingPage section="classics" />} />
        <Route path="/everyday/:categorySlug" element={<CategoryListingPage section="everyday" />} />
           <Route path="/products/:slug" element={<ProductPage />} />
 </Route>
 </Routes>
 
 
 </BrowserRouter>

 
  )
}

export default App
