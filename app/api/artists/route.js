import Artist from "@/models/artistModel";
import spotifyApi from "../spotify"; // Import the shared SpotifyWebApi instance
import connectDB from "@/utils/db";

export async function GET(req) {
	await connectDB();
	const dd = await spotifyApi.clientCredentialsGrant();
	const token = dd.body["access_token"];
	spotifyApi.setAccessToken(token);

	const artist = await Artist.find({});

	return new Response(JSON.stringify({ data: artist }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
