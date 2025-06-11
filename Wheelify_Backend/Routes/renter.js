import express from "express";
import auth from "../Middlewares/auth.js";
import searchAvailableBikes from "../Controllers/Renter/searchBike.js";
import getBikeDetails from "../Controllers/Renter/getBikeDetails.js";
import addToUserCart from "../Controllers/Renter/addToUserCart.js";
import removeFromUserCart from "../Controllers/Renter/removeFromUserCart.js";

const router = express.Router();

router.post("/search-available-bikes", auth, searchAvailableBikes);
router.get("/get-bike-details", auth, getBikeDetails);
router.post("/add-to-user-cart", auth, addToUserCart);
router.post("/remove-from-user-cart", auth, removeFromUserCart);

export default router;
