import express from "express";
import dotenv from "dotenv";
import dbConnection from "./Config/dbConnection.js";
import loginSignup from "./Routes/loginSignup.js";
import profile from "./Routes/profile.js";
import provider from "./Routes/provider.js";
import renter from "./Routes/renter.js";
import ratingAndReviews from "./Routes/ratingAndReviews.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


//connect db
dbConnection();

//mount router
app.use("/api/v1", loginSignup);
app.use("/api/v1", profile);
app.use("/api/v1", provider);
app.use("/api/v1", renter);
app.use("/api/v1", ratingAndReviews);

//start server
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})


