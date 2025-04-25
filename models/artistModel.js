import mongoose from "mongoose";
import imageSchema from "./imageModel";

const artistSchema = new mongoose.Schema({
    spotifyId: { type: String, required: true },
    name: { type: String, required: true },
    follower: Number,
    popularity: Number,
    total_albums: Number,
    images: [imageSchema],
})

const Artist = mongoose.models.Artist || mongoose.model("Artist", artistSchema)
export default Artist;
