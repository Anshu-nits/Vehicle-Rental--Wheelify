// import bcrypt from "bcrypt";
// import User from "../../Models/User.js";
// import OTP from "../../Models/OTP.js";

// const otpVerificationAndPasswordReset = async (req, res) => {
//   try {
//     const { email, password, otp } = req.body;

//     // Check if all fields are present
//     if (!otp || !email || !password ) {
//       return res
//         .status(403)
//         .json({ success: false, message: "All fields are required" });
//     }

//     // Verify OTP
//     const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
//     if (response.length === 0 || response[0].otp !== otp) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid OTP" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create User with data directly in User schema
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
//     });

//     return res
//       .status(200)
//       .json({ success: true, user, message: "User registered successfully" });

//   } catch (error) {
//     console.error("Signup error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Signup failed. Please try again." });
//   }
// };

// export default otpVerificationAndPasswordReset;


import bcrypt from "bcrypt";
import User from "../../Models/User.js";
import OTP from "../../Models/OTP.js";

const otpVerificationAndPasswordReset = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // Check if all fields are present
    if (!otp || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Verify OTP
    const otpRecord = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    
    if (otpRecord.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not found or expired" });
    }

    if (otpRecord[0].otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Delete the used OTP for security
    await OTP.deleteOne({ _id: otpRecord[0]._id });

    return res
      .status(200)
      .json({ 
        success: true, 
        message: "Password reset successfully" 
      });

  } catch (error) {
    console.error("Password reset error:", error);
    return res
      .status(500)
      .json({ 
        success: false, 
        message: "Password reset failed. Please try again." 
      });
  }
};

export default otpVerificationAndPasswordReset;
