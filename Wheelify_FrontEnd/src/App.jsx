import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext/AuthContext.jsx';

import LandingPage from './Pages/LandingPage.jsx';
import LoginPage from './Pages/Login.jsx';
import HeaderNoAuth from './components/LandingPage/HeaderNoAuth.jsx';
import HeaderAuth from './components/LandingPage/HeaderAuth.jsx';
import Footer from './components/LandingPage/Footer.jsx'; 
import Otp from './Pages/Otp.jsx';
import Signup from './Pages/Signup.jsx';
import SearchBike from './Pages/SearchBike.jsx';
import AvailableBikes from './components/SearchBike/AvailableBikes.jsx';
import ShareBike from './Pages/ShareBike.jsx';
import MyProfile from './Pages/MyProfile.jsx';
import PrivateRoute from './AuthContext/PrivateRoute.jsx';
import BikeDetails from './components/Bike/BikeDetails.jsx';
import MyRegisteredBikes from './Pages/MyRegisteredBikes.jsx';

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {/* Conditionally render Header */}
      {token ? <HeaderAuth /> : <HeaderNoAuth />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/signup" element={<Signup />} />

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
        <Route path="/profile" element={
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        } />
      </Routes>

      <Footer /> 
    </Router>
  );
};

export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from './AuthContext/AuthContext.jsx';
// import LandingPage from './Pages/LandingPage.jsx';
// import LoginPage from './Pages/Login.jsx';
// import HeaderNoAuth from './components/LandingPage/HeaderNoAuth.jsx';
// import HeaderAuth from './components/LandingPage/HeaderAuth.jsx';
// import Footer from './components/LandingPage/Footer.jsx'; 
// import Otp from './Pages/Otp.jsx';
// import Signup from './Pages/Signup.jsx';
// import SearchBike from './Pages/SearchBike.jsx';
// import ShareBike from './Pages/ShareBike.jsx';
// import MyProfile from './Pages/MyProfile.jsx';
// import PrivateRoute from './AuthContext/PrivateRoute.jsx';

// const App = () => {
//   const { token } = useContext(AuthContext);

//   return (
//     <Router>
//       {token ? <HeaderAuth /> : <HeaderNoAuth />}

//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/otp" element={<Otp />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/search-bike" element={<SearchBike />} />
//         <Route path="/share-bike" element={<ShareBike />} /> 

//         {/* ✅ Protected Profile Route */}
//         <Route path="/profile" element={
//           <PrivateRoute>
//             <MyProfile />
//           </PrivateRoute>
//         } />
//       </Routes>

//       <Footer /> 
//     </Router>
//   );
// };

// export default App;

