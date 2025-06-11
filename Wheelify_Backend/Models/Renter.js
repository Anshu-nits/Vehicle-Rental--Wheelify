import mongoose from "mongoose";

const renterSchema = new mongoose.Schema({
    userDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const Renter = mongoose.model("Renter", renterSchema);
export default Renter;