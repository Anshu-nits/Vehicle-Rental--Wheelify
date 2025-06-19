import express from "express";
import auth from "../Middlewares/auth.js";
import { createRating, getTopRatings, getUserRating } from "../Controllers/Platform/platformRating.js";


const router = express.Router();

router.post("/rate-platform", auth, createRating);
router.get("/get-top-rating", getTopRatings);
router.get("/my-rating", auth, getUserRating);
export default router;