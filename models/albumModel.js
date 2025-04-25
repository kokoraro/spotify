import mongoose from "mongoose";
import imageSchema from "./imageModel";

export const albumSchema = new mongoose.Schema({
    artistId: { type: String, required: true },
    albumId: { type: String, required: true },
    total_tracks: { type: Number, required: true },
    spotify_url: { type: String, required: true },
    images: [imageSchema],
    name: { type: String, required: true },
    release_date: { type: String, required: true },
    popularity: Number,
})

const Album = mongoose.models.Album || mongoose.model("Album", albumSchema)
export default Album;
