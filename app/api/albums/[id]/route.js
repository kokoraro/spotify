import { extractTrackName } from "@/utils";
import spotifyApi from "../../spotify"; // Import the shared SpotifyWebApi instance

export async function GET(req, { params }) {
    const { id } = await params;

    const dd = await spotifyApi.clientCredentialsGrant();
    const token = dd.body["access_token"];
    spotifyApi.setAccessToken(token);

    if (!id) {
        return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const data = await spotifyApi.getAlbum(id);

    let tracksResponse = await spotifyApi.getAlbumTracks(id);
    let tracks = tracksResponse.body.items;

    while (tracksResponse.body.next) {
        tracksResponse = await spotifyApi.getAlbumTracks(id, { offset: tracks.length });
        tracks.push(...tracksResponse.body.items);
    }

    let filteredTracks = tracks.filter((track) => track.duration_ms >= 120000);

    return new Response(JSON.stringify({ data: data.body, tracks: filteredTracks }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
