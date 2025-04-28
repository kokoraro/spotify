import connectDB from "@/utils/db";
import spotifyApi from "../spotify"; // Import the shared SpotifyWebApi instance

export async function GET(req) {
	const data = await spotifyApi.clientCredentialsGrant();
	const token = data.body["access_token"];
	spotifyApi.setAccessToken(token);
	await connectDB();
	return new Response(JSON.stringify({ token }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
