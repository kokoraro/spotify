import Track from "@/models/trackModel";

export async function GET(req) {
	const url = new URL(req.url);
	const artistId = url.searchParams.get("artist");

	if (!artistId) {
		return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const albums = await Track.find({ artistId });

	return new Response(JSON.stringify({ data: albums }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
