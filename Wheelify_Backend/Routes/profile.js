import express from "express";
import updateProfile from "../Controllers/Profile/updateProfile.js";
import getProfileDetails from "../Controllers/Profile/getProfileDetails.js";
import deleteProfile from "../Controllers/Profile/deleteProfile.js";
import sendContactForm from "../Controllers/LoginAndSignup/contactUs.js";
import auth from "../Middlewares/auth.js";
import {upload} from "../Config/multerSetup.js";

const router = express.Router();

router.put(
    "/update-profile",
    upload.fields([
      {
        name: "profilePicture",
        maxCount: 1,
      },
    ]),
    auth,
    updateProfile
  );

router.get("/get-profile-details", auth, getProfileDetails);
router.delete("/delete-profile", auth, deleteProfile);
router.post('/contact', auth, sendContactForm);

export default router;