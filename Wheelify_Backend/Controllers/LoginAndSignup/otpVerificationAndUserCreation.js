import bcrypt from "bcrypt";
import User from "../../Models/User.js";
import OTP from "../../Models/OTP.js";

const otpVerificationAndUserCreation = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, otp } = req.body;

    // Check if all fields are present
    if (!otp || !name || !email || !password || !confirmPassword) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }

    // Verify OTP
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || response[0].otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User with data directly in User schema
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    return res
      .status(200)
      .json({ success: true, user, message: "User registered successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Signup failed. Please try again." });
  }
};

export default otpVerificationAndUserCreation;

// import bcrypt from "bcrypt";
// import User from "../../Models/User.js";
// import Profile from "../../Models/Profile.js";
// import OTP from "../../Models/OTP.js";

// const otpVerificationAndUserCreation = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword, otp } = req.body;

//     if (!otp || !name || !email || !password || !confirmPassword) {
//       return res.status(403).json({ success: false, message: "All fields are required" });
//     }

//     const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
//     if (response.length === 0 || response[0].otp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const profile = await Profile.create({
//       gender: null,
//       dateOfBirth: null,
//       contactNumber: null,
//       address: null,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
//     });

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       additionalDetails: profile._id,
//     });

//     return res.status(200).json({ success: true, user, message: "User registered successfully" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     return res.status(500).json({ success: false, message: "Signup failed. Please try again." });
//   }
// };

// export default otpVerificationAndUserCreation;
