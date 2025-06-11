import express from "express";
import updateProfile from "../Controllers/Profile/updateProfile.js";
import getProfileDetails from "../Controllers/Profile/getProfileDetails.js";
import deleteProfile from "../Controllers/Profile/deleteProfile.js";
import auth from "../Middlewares/auth.js";
import {upload} from "../Config/multerSetup.js";

const router = express.Router();

router.post(
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

export default router;