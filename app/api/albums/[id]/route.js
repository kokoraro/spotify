import Album from "@/models/albumModel";
import Track from "@/models/trackModel";

export async function GET(req, { params }) {
	const { id } = await params;

	const album = await Album.findOne({ albumId: id })

	return new Response(JSON.stringify({ data: album }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
