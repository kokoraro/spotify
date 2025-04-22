import spotifyApi from "../spotify"; // Import the shared SpotifyWebApi instance

export async function GET(req) {
    const dd = await spotifyApi.clientCredentialsGrant();
	const token = dd.body["access_token"];
	spotifyApi.setAccessToken(token);
	const url = new URL(req.url);
	const ids = url.searchParams.get("ids"); 
	if (!ids) {
		return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const artistIds = ids.split(","); 
	const data = await Promise.all(artistIds.map(id => spotifyApi.getArtist(id))); 

	return new Response(JSON.stringify({ data: data.map(d => d.body) }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
