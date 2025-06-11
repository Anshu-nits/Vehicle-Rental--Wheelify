import Bike from "../../Models/Bike.js";
import User from "../../Models/User.js";
import { uploadOnCloudinary } from "../../Config/cloudinaryConnection.js";

/*

*/
const registerBike = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    const { company, model, age } = req.body;

    console.log(company);
    console.log(model);
    console.log(age);
 
    // Check if any of the required fields are missing
    if (!company || !model || !age) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory, including images.",
      });
    }

    // Get the thumbnail and ownershipProof images from request files
    const thumbnail = req.files?.thumbnail?.[0]?.path;
    const ownershipProof = req.files?.ownershipProof?.[0]?.path;

    console.log(thumbnail);
    console.log(ownershipProof);

    if (!thumbnail || !ownershipProof) {
        return res.status(400).json({
          success: false,
          message: "Documents can't be skipped",
        });
      }
    
    // Upload thumbnail image to Cloudinary
    const thumbnailUploadResponse = await uploadOnCloudinary(thumbnail);
    if (!thumbnailUploadResponse.url) {
      return res.status(500).json({
        success: false,
        message: "Thumbnail image upload failed.",
      });
    }

    // Upload ownershipProof image to Cloudinary
    const ownershipProofUploadResponse = await uploadOnCloudinary(ownershipProof);
    if (!ownershipProofUploadResponse.url) {
      return res.status(500).json({
        success: false,
        message: "Ownership proof image upload failed.",
      });
    }

    // Create a new Car document
    const newBike = await Bike.create({
      company,
      model,
      age,
      ownershipProof: ownershipProofUploadResponse.url, // Set ownership proof URL
      img: thumbnailUploadResponse.url, // Set thumbnail URL
      Owner: userId,
    });

    // Update the User document with the new car ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.registeredBikes.push(newBike._id);
    await user.save();

    // Respond with success and the new car details
    res.status(201).json({
      success: true,
      message: "Vehicle registered successfully.",
      car: newBike,
    });
  } catch (error) {
    // Handle any errors that occur during the registration
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to register vehicle.",
      error: error.message,
    });
  }
};

export default registerBike;
