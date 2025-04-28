import mongoose from "mongoose";

export const stateScheme = new mongoose.Schema({
	artistId: { type: String, required: true },
	albumId: [{ type: String, required: true }],
	time: { type: Number, required: true },
});

const State = mongoose.models.State || mongoose.model("State", stateScheme);
export default State;
