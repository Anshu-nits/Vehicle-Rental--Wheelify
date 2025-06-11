import express from "express";
import auth from "../Middlewares/auth.js";
import createRatingAndReview from "../Controllers/RatingAndReviews/createRating.js";
import getAllRatingsAndReviews from "../Controllers/RatingAndReviews/getAllRating.js";
import getAverageRating from "../Controllers/RatingAndReviews/getAverageRating.js";

const router = express.Router();

router.post("/create-rating-and-review", auth, createRatingAndReview);
router.get("/get-all-ratings-and-reviews", auth, getAllRatingsAndReviews);
router.get("/get-average-rating", auth, getAverageRating);

export default router;
