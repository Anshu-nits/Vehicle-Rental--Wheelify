import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    userDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;