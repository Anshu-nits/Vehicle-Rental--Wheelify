import User from "../../Models/User.js";

const getProfileDetails = async (req, res) => {
  try {
    const id = req.user.id;

    // Fetch user details directly from the User schema
    const userDetails = await User.findById(id).exec();
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default getProfileDetails;

// import User from "../../Models/User.js";

// const getProfileDetails = async (req, res) => {
//     try {
//         const id = req.user.id;
//         const userDetails = await User.findById(id)
//             .populate("additionalDetails")
//             .exec();
//         res.status(200).json({
//             success: true,
//             message: "User Data fetched successfully",
//             data: userDetails,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// export default getProfileDetails;