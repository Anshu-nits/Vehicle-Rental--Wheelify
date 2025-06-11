// /Wheelify
// │
// ├── /frontend
// │   ├── /src
// │   │   ├── /AuthContext
// │   │   │   ├── AuthContext.jsx
// │   │   │   └── PrivateRoute.jsx
// │   │   │
// │   │   ├── /components
// │   │   │   ├── /LandingPage
// │   │   │   │   ├── HeaderNoAuth.jsx
// │   │   │   │   ├── HeaderAuth.jsx
// │   │   │   │   ├── Footer.jsx
// │   │   │   │   └── ProfileDropdown.jsx
// │   │   │   └── ... (possibly others like BikeCard.jsx, etc.)
// │   │   │
// │   │   ├── /Pages
// │   │   │   ├── LandingPage.jsx
// │   │   │   ├── Login.jsx
// │   │   │   ├── Signup.jsx
// │   │   │   ├── Otp.jsx
// │   │   │   ├── SearchBike.jsx
// │   │   │   ├── ShareBike.jsx
// │   │   │   └── MyProfile.jsx
// │   │   │
// │   │   ├── App.jsx
// │   │   ├── main.jsx (if using Vite)
// │   │   └── index.css / styles.css
// │   │
// │   ├── /public
// │   └── package.json
// │
// ├── /backend
// │   ├── /models
// │   │   ├── User.js
// │   │   ├── OTP.js
// │   │   └── Profile.js
// │   │
// │   ├── /routes
// │   │   ├── authRoutes.js
// │   │   └── userRoutes.js
// │   │
// │   ├── /controllers
// │   │   ├── authController.js (with signup, otp verification logic)
// │   │   └── userController.js
// │   │
// │   ├── /middlewares
// │   │   └── authMiddleware.js
// │   │
// │   ├── config/
// │   │   └── db.js
// │   │
// │   ├── server.js / index.js
// │   └── .env
// │
// ├── .gitignore
// └── README.md


import User from "../../Models/User.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Validation passed" });
  } catch (error) {
    console.error("Error validating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default signup;
