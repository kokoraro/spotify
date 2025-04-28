import State from "@/models/stateModel";

export async function GET(req) {
	const state = await State.find({});

	return new Response(JSON.stringify({ data: state || [] }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
