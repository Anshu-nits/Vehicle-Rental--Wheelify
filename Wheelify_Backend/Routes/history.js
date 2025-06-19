import express from "express";
import auth from "../Middlewares/auth.js";
import addToHistory from "../Controllers/PaymentAndHistories/addToHistory.js";
import cancelBooking from "../Controllers/PaymentAndHistories/cancelBooking.js";
import markAsPickedUp from "../Controllers/PaymentAndHistories/markAsPickup.js";
import markAsReturned from "../Controllers/PaymentAndHistories/markAsReturned.js";
import getRentalHistory from "../Controllers/PaymentAndHistories/getRentalHistory.js";



const router = express.Router();

router.post("/add-to-history", auth, addToHistory);
router.post("/cancel-booking", auth, cancelBooking);
router.post("/mark-pickedup", auth, markAsPickedUp);
router.post("/mark-returned", auth, markAsReturned);
router.get("/get-rental-history",auth, getRentalHistory);



export default router;