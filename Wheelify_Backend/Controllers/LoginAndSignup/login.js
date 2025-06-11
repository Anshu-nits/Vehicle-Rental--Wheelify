import User from "../../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user without populating additionalDetails
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us. Please Sign Up to Continue`,
      });
    }

    // Compare passwords
    if (await bcrypt.compare(password, user.password)) {
      // Generate token
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          accountType: user.accountType, // This is optional, depending on if you're storing accountType
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Save token to user
      user.token = token;
      user.password = undefined;

      // Cookie options
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
      };

      // Send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure. Please Try Again.`,
    });
  }
};

export default login;

// import User from "../../Models/User.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import dotenv from "dotenv";
// dotenv.config();

// const login = async (req, res) => {
//   /*
//     1.Get email and password from request body
//     2.Check if email or password is missing
//     3.Find user with provided email
//     4.If user not found with provided email
//     5.Compare Password
//     *** if step 5 success else error
//     6.Generate JWT token 
//     7.Save token to user document in database
//     8.Set cookie for token and return success response

//     "email":"abhaydasad78@gmail.com",
//     "password":"12345"
//     */
//   try {
//     /*--1--*/
//     const { email, password } = req.body;

//     /*--2--*/
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: `Please Fill up All the Required Fields`,
//       });
//     }

//     /*--3--*/
//     const user = await User.findOne({ email }).populate("additionalDetails");

//     /*--4--*/
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: `User is not Registered with Us Please SignUp to Continue`,
//       });
//     }

//     /*--5--*/
//     if (await bcrypt.compare(password, user.password)) {
//       /*--6--*/
//       const token = jwt.sign(
//         {
//           email: user.email,
//           id: user._id,
//           accountType: user.accountType,
//         },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "24h",
//         }
//       );

//       /*--7--*/
//       user.token = token;
//       user.password = undefined;

//       const options = {
//         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//       };
//       console.log(token);
//       /*--8--*/
//       res.cookie("token", token,options).status(200).json({
//         success: true,
//         token,
//         user,
//         message: `User Login Success`,
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: `Password is incorrect`,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: `Login Failure Please Try Again`,
//     });
//   }
// };

// export default login;
