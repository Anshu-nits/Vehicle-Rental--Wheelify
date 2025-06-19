import Bike from "../../Models/Bike.js";

const getBikeDetail = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id)
                 .populate("Owner", "name email contactNumber image");
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found" });
    }

    res.status(200).json({ success: true, data: bike });
  } catch (error) {
    console.error("Error in getBikeDetail:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};      

export default getBikeDetail; 

