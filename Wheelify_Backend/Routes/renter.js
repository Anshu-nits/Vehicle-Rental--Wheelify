import express from "express";
import auth from "../Middlewares/auth.js";
import searchAvailableBikes from "../Controllers/Renter/searchBike.js";
import getBikeDetails from "../Controllers/Renter/getBikeDetails.js";
import addToUserCart from "../Controllers/Renter/addToUserCart.js";
import removeFromUserCart from "../Controllers/Renter/removeFromUserCart.js";
import getCartDetails from "../Controllers/Renter/getCartDetails.js";
import clearUserCart from "../Controllers/Renter/clearUserCart.js";
import { addBikeRating } from "../Controllers/Renter/addBikeRating.js";

const router = express.Router();

router.post("/search-available-bikes", auth, searchAvailableBikes);
router.get("/get-bike-details", auth, getBikeDetails);
router.post("/add-to-user-cart", auth, addToUserCart);
router.post("/remove-from-user-cart", auth, removeFromUserCart);
router.get("/get-cart-details", auth, getCartDetails);
router.post("/clear-user-cart", auth, clearUserCart);
router.get("/bike/:id", auth, getBikeDetails);
router.post("/add-bike-rating/:bookingId", auth, addBikeRating)

export default router;
