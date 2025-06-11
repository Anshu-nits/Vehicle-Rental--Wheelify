import User from "../../Models/User.js";
import { uploadOnCloudinary } from "../../Config/cloudinaryConnection.js";

const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", contactNumber, address = "", gender = "" } = req.body;

    // Get user ID from request
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields directly
    user.dateOfBirth = dateOfBirth;
    user.contactNumber = contactNumber;
    user.address = address;
    user.gender = gender;

    // Handle profile picture upload, if provided
    if (req.files?.profilePicture?.[0]?.path) {
      const profilePicture = req.files.profilePicture[0].path;
      const image = await uploadOnCloudinary(profilePicture);
      user.image = image.url; // Update profile picture
    }

    // Save updated user
    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: user, // now includes all updated fields
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default updateProfile;


// import User from "../../Models/User.js";
// import Profile from "../../Models/Profile.js";
// import { uploadOnCloudinary } from "../../Config/cloudinaryConnection.js";

// const updateProfile = async (req, res) => {
//   try {
//     const { dateOfBirth = "", contactNumber, address = "", gender = "" } = req.body;

//     // Get user ID from request
//     const userId = req.user.id;
//     const user = await User.findById(userId).populate("additionalDetails");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Fetch the profile associated with the user
//     const profile = await Profile.findById(user.additionalDetails._id);

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: "Profile not found",
//       });
//     }

//     // Update basic profile details
//     profile.dateOfBirth =  dateOfBirth;
//     profile.contactNumber = contactNumber;
//     profile.address = address;
//     profile.gender = gender;

//     // Handle profile picture upload, if provided
//     if (req.files?.profilePicture?.[0]?.path) {
//       const profilePicture = req.files.profilePicture[0].path;
//       const image = await uploadOnCloudinary(profilePicture);
//       profile.image = image.url; // Update profile picture
//     }

//     // Save updated profile
//     await profile.save();

//     return res.json({
//       success: true,
//       message: "Profile updated successfully",
//       profile,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export default updateProfile;
