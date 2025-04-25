import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    height: { type: Number, required: true },
    width: { type: Number, required: true },
});

export default imageSchema;