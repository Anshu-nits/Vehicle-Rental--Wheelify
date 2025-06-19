import express from "express";
import auth from "../Middlewares/auth.js";
import { upload } from "../Config/multerSetup.js";
import registerBike from "../Controllers/Provider/registerBike.js";
import getRegisteredBikes  from "../Controllers/Provider/getRegisteredBikes.js";
import unregisterBike from "../Controllers/Provider/unregisterBike.js";
import provideBike from "../Controllers/Provider/provideBike.js";
import removeProvidedBike from "../Controllers/Provider/removeProvidedBike.js";
import getAllProvidedBikeDetails from "../Controllers/Provider/getProvidedBikeDetails.js";


const router = express.Router();

router.post(
  "/register-bike",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "ownershipProof", maxCount: 1 }, 
  ]),
  auth,
  registerBike
);
router.get("/my-bikes", auth, getRegisteredBikes);
router.post("/unregister-bike", auth, unregisterBike);
router.post("/provide-bike", auth, provideBike);        
router.post("/remove-provided-bike", auth, removeProvidedBike);
router.get("/get-provided-bikes", auth, getAllProvidedBikeDetails);

export default router;

