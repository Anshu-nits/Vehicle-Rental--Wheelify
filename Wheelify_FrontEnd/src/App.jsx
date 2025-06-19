import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext/AuthContext.jsx';

import LandingPage from './Pages/LandingPage.jsx';
import LoginPage from './Pages/Login.jsx';
import HeaderNoAuth from './components/LandingPage/HeaderNoAuth.jsx';
import HeaderAuth from './components/LandingPage/HeaderAuth.jsx';
import Footer from './components/LandingPage/Footer.jsx'; 
import Otp from './Pages/Otp.jsx';
import PassworOtp from './Pages/otpPassword.jsx'
import Signup from './Pages/Signup.jsx';
import SearchBike from './Pages/SearchBike.jsx';
import AvailableBikes from './components/SearchBike/AvailableBikes.jsx';
import ShareBike from './Pages/ShareBike.jsx';
import MyProfile from './Pages/MyProfile.jsx';
import PrivateRoute from './AuthContext/PrivateRoute.jsx';
import MyRegisteredBikes from './Pages/MyRegisteredBikes.jsx';
import MyCart from './Pages/MyCart.jsx';
import BikeDetails from './components/Bike/BikeDetails.jsx';
import MyBookings from './Pages/MyBookings.jsx';
import WalletPage from './Pages/Wallet.jsx';
import BikeDetail from './Pages/BikeDetail.jsx';
import ScrollToTop from './components/LandingPage/ScrollToTop.jsx';
import AllProvidedBikes from './Pages/AllProvidedBikes.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx'
import MyBikes from './Pages/MyBikes.jsx'

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {/* ✅ Fixed Header */}
      <ScrollToTop />
      {token ? <HeaderAuth /> : <HeaderNoAuth />}

      {/* ✅ Add top padding to avoid overlap with fixed header */}
      <div className="pt-20 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/otpVerification" element={<PassworOtp />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ Protected Routes */}
          <Route path="/registered-bikes" element={
            <PrivateRoute>
              <MyRegisteredBikes />
            </PrivateRoute>
          } />
          <Route path="/search-bike" element={
            <PrivateRoute>
              <SearchBike />
            </PrivateRoute>
          } />
          <Route path="/available-bike" element={
            <PrivateRoute>
              <AvailableBikes />
            </PrivateRoute>
          } />
          <Route path="/bike-details" element={
            <PrivateRoute>
              <BikeDetails />
            </PrivateRoute>
          } />
          <Route path="/share-bike" element={
            <PrivateRoute>
              <ShareBike />
            </PrivateRoute>
          } />
          <Route path="/cart" element={
            <PrivateRoute>
              <MyCart />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          } />
          <Route path="/bike-detail" element={
            <PrivateRoute>
              <BikeDetails />
            </PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          } />
          <Route path="/wallet" element={
            <PrivateRoute>
              <WalletPage />
            </PrivateRoute>
          } />
          <Route path="/bike/:id" element={
            <PrivateRoute>
              <BikeDetail />
            </PrivateRoute>
          } />
          <Route path="/bikes" element={
            <PrivateRoute>
              <AllProvidedBikes />
            </PrivateRoute>
          } />
          <Route path="/my-bike" element={
            <PrivateRoute>
              <MyBikes />
            </PrivateRoute>
          } />
        </Routes>
      </div>

      {/* ✅ Footer */}
      <Footer />
    </Router>
  );
};

export default App;