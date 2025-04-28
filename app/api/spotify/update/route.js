import Artist from "@/models/artistModel";
import State from "@/models/stateModel";
import spotifyApi from "../../spotify";

export async function updateStates() {
	const state = await State.find({});

	const newState = new State({ artistId: "123123123", albumId: "1231231", time: 123 });
	await newState.save();

	const credential = await spotifyApi.clientCredentialsGrant();
	const token = credential.body["access_token"];
	spotifyApi.setAccessToken(token);

	const artist = await Artist.find({});
}

export async function GET(req) {
	const state = await updateStates();

	return new Response("Hello");

	// return new Response(JSON.stringify({ data: "ok" }), {
	// 	status: 200,
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// });
}
