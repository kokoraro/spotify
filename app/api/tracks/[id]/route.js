import Track from "@/models/trackModel";

export async function GET(req, { params }) {
	const { id } = await params;

	const tracks = await Track.find({ albumId: id });

	return new Response(JSON.stringify({ data: tracks }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
