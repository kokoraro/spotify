import Album from "@/models/albumModel";

export async function GET(req) {
	const url = new URL(req.url);
	const artistId = url.searchParams.get("artist");

	console.log("Here", artistId);

	if (!artistId) {
		return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const albums = await Album.find({ artistId }).sort({ release_date: -1 });

	console.log("Here");

	return new Response(JSON.stringify({ data: albums }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
