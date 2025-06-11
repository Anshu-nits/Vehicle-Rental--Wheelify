import User from "../../Models/User.js";
import Bike from "../../Models/Bike.js";

const removeFromUserCart = async (req, res) => {
  try {
    const { bikeId } = req.body;

    // Extract userId from the authenticated user
    const userId = req.user.id;

    // Validate input
    if (!bikeId) {
      return res.status(400).json({
        success: false,
        message: "Bike ID is required.",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the bike exists
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found.",
      });
    }

    // Check if the bike is already in the cart
    if (!user.cart.includes(bikeId)) {
      return res.status(400).json({
        success: false,
        message: "Bike is not in your cart.",
      });
    }

    // Remove the bike from the user's cart
    user.cart = user.cart.filter((bikeIdInCart) => bikeIdInCart.toString() !== bikeId.toString());

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Bike successfully removed from your cart.",
      cart: user.cart,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to remove bike from cart.",
      error: error.message,
    });
  }
};

export default removeFromUserCart;
