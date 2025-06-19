import express from "express";
import signup from "../Controllers/LoginAndSignup/signup.js";
import generateOTP from "../Controllers/LoginAndSignup/generateOTP.js";
import otpVerificationAndUserCreation from "../Controllers/LoginAndSignup/otpVerificationAndUserCreation.js"
import login from "../Controllers/LoginAndSignup/login.js";
import changePassword from "../Controllers/LoginAndSignup/changePassword.js";
import auth from "../Middlewares/auth.js";
import { resetPassword, resetPasswordToken } from "../Controllers/LoginAndSignup/resetPassword.js";
import getPopularBikeList from "../Controllers/LoginAndSignup/getPopularBIkeList.js"
import otpVerificationAndPasswordReset from "../Controllers/LoginAndSignup/otpVerificationAndPasswordReset.js";
import deleteAccount from "../Controllers/LoginAndSignup/deleteAccount.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/otp-verification-and-user-creation", otpVerificationAndUserCreation);
router.post("/otp-verification-and-password-reset", otpVerificationAndPasswordReset);
router.post("/generate-otp", generateOTP);
router.post("/changePassword", auth, changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);
router.get("/popular-bikes", getPopularBikeList);
router.delete("/delete-account", auth, deleteAccount);

export default router;