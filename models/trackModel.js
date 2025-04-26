import mongoose from "mongoose";

export const trackSchema = new mongoose.Schema({
	artistId: { type: String, required: true },
	albumId: [{ type: String, required: true }],
	trackId: { type: String, required: true },
	external_url: String,
	preview_url: String,
	duration_ms: { type: Number, required: true },
	track_number: Number,
	name: { type: String, required: true },
});

const Track = mongoose.models.Track || mongoose.model("Track", trackSchema);
export default Track;
