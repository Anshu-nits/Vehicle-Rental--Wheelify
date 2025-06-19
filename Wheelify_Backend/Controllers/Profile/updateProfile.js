import User from "../../Models/User.js";
import { uploadOnCloudinary } from "../../Config/cloudinaryConnection.js";

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      dateOfBirth = "",
      contactNumber,
      address = "",
      gender = ""
    } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // === Update User Fields ===
    if (name) user.name = name;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (contactNumber) user.contactNumber = contactNumber;
    if (address) user.address = address;
    if (gender) user.gender = gender;

    // === Handle Profile Picture Upload ===
    if (req.files?.profilePicture?.[0]?.path) {
      const filePath = req.files.profilePicture[0].path;
      const uploadedImage = await uploadOnCloudinary(filePath);
      if (uploadedImage?.url) {
        user.image = uploadedImage.url;
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default updateProfile;