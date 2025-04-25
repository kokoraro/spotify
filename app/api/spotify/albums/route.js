import connectDB from "@/utils/db";
import spotifyApi from "../../spotify"; // Import the shared SpotifyWebApi instance
import Track from "@/models/trackModel";
import Album from "@/models/albumModel";
import axios from "axios";
import { load } from "cheerio";

async function getSpotifyLinks(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = load(html);
        const scdnLinks = new Set();

        $('*').each((i, element) => {
            const attrs = element.attribs;
            Object.values(attrs).forEach(value => {
                if (value && value.includes('p.scdn.co')) {
                    scdnLinks.add(value);
                }
            });
        });
        return Array.from(scdnLinks);
    } catch (error) {
    }
}

export async function GET(req) {
    const credential = await spotifyApi.clientCredentialsGrant();
    const token = credential.body["access_token"];
    spotifyApi.setAccessToken(token);

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const artistId = url.searchParams.get("artistid");

    if (!id) {
        return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const data = await spotifyApi.getAlbum(id);
    const albumData = data.body;

    const { id: albumId, total_tracks, name, release_date, popularity } = albumData;
    const { url: src, height, width } = albumData.images[0]
    const spotify_url = albumData.external_urls.spotify;
    const image = { src, height, width }
    const newAlbum = { artistId, albumId, total_tracks, name, release_date, popularity, images: [image], spotify_url }

    const existingAlbum = await Album.findOne({ albumId })
    if (existingAlbum)
        return new Response(JSON.stringify({ data: [] }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    const album = new Album(newAlbum);
    await album.save();

    console.log("2")

    let tracksResponse = await spotifyApi.getAlbumTracks(id);
    let tracks = tracksResponse.body.items;

    let i = 1;

    while (tracksResponse.body.next || i <= 2) {
        tracksResponse = await spotifyApi.getAlbumTracks(id, { offset: tracks.length });
        tracks.push(...tracksResponse.body.items);
        i++;
    }

    console.log("3")

    // Filter longer than 2mins
    let filteredTracks = tracks.filter((track) => track.duration_ms >= 120000);

    // Filter excluding strings
    const keywords = ["outro", "intro", "upcoming", "shout outs"];

    // Extract Track IDs only
    const tracksIds = filteredTracks.map(track => track.id)

    filteredTracks = [];

    for (const trackId of tracksIds) {
        const trackRes = await spotifyApi.getTrack(trackId)
        const trackData = trackRes.body;

        const { id, name, duration_ms, track_number } = trackData;
        const external_urls = trackData.external_urls.spotify;

        let normalizedName = name.split('(')[0].trim()
        normalizedName = normalizedName.split('-')[0].trim()
        if (keywords.some(keyword => normalizedName.toLowerCase().includes(keyword)))
            continue;

        console.log(normalizedName)

        const preview_urls = await getSpotifyLinks(external_urls);
        const preview_url = preview_urls.length > 0 ? preview_urls[0] : "empty"

        const newTrackData = { artistId, albumId, trackId: id, name: normalizedName, external_urls, duration_ms, track_number, preview_url };

        const existingTrack = await Track.findOne({ name: newTrackData.name })

        if (!existingTrack) {
            const newTrack = new Track(newTrackData);
            await newTrack.save();
        }
    }

    console.log("4")

    return new Response(JSON.stringify({ data: albumData }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}