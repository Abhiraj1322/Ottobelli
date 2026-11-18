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
import useAuthStore from './store/userAuthStore'
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
import AdminBulkUpload from './components/account/AdminBulkUpload'
import CheckoutPage from './Pages/CheckoutPage'
import OrderConfirmationPage from './Pages/OrderConfirmationPage'
import UserOrdersPage from './Pages/UserOrderPage'
import AdminOrderPage from './Pages/AdminOrderPage'
import AdminRoute from './components/protectedroute/AdminRoute'
import CartDrawer from './components/layout/CartDrawer'
import AccountBar from './components/account/AccountSidebar'
import api from './api/axios'
function App() {
  const [count, setCount] = useState(0)
  const [showCart, setShowCart] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
const{checkAuth}=useAuthStore()

const user = useAuthStore((state) => state.user);
const googleLogin = useAuthStore((state) => state.googleLogin);
  // On every page load/refresh — check if user is still logged in
  useEffect(() => {
    checkAuth();
  }, []);
const handleOpenCart = () => {
  setShowCart(true);
};

const handleOpenAccount = () => {
  setShowAccount(true);
};
// Get logout action from Zustand
const logout = useAuthStore((state) => state.logout);

const handleLogout = () => {
  // Clear authentication state and localStorage
  logout();

  // Close account drawer
  setShowAccount(false);

  // Close cart drawer
  setShowCart(false);

  console.log("User logged out successfully");
};

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    await googleLogin(credentialResponse.credential);
    setShowAccount(false);
  } catch (error) {
    console.error("Google login failed:", error);
  }
};

  const NavbarLayout = () => {
  return (
    <>
      <Navbar onOpenCart={handleOpenCart}
        onOpenAccount={handleOpenAccount} /> {/* Navbar only lives inside this wrapper! */}
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

<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
 <Route element={<NavbarLayout />}>
 
<Route path='/everyday' element={<EverydayPage/>}/>
<Route path='/classics' element={<ClassicsPage/>}/>
 <Route path='/' element={<LandingPage/>}/>


   <Route path="/checkout" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />      


        <Route path="/order-confirmation/:id" element={
          
          <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />

<Route path="/account/orders" element={
  <ProtectedRoute><UserOrdersPage /></ProtectedRoute>} />
 <Route path="/favorites" element={
          <ProtectedRoute><FavoritesPage /></ProtectedRoute>
        } />
        <Route element={<AdminRoute/>}>
          <Route path="/admin/orders" element={<AdminOrderPage />} />
        <Route path="/admin/bulk-upload" element={<AdminBulkUpload />} />
        </Route>

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
           <Route path="/products/:slug" element={<ProductPage onOpenCart={handleOpenCart}    onOpenAccount={handleOpenAccount} />}
         />
 </Route>
 </Routes>
  <CartDrawer
  isOpen={showCart}
  onClose={() => setShowCart(false)}
/>
<AccountBar
    isOpen={showAccount}
    onClose={() => setShowAccount(false)}
    user={user}
    onGoogleSuccess={handleGoogleSuccess}
    onLogout={handleLogout}
  />
 </BrowserRouter>

 
  )
}

export default App
