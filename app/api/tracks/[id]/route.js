import axios from "axios";
import spotifyApi from "../../spotify"; // Import the shared SpotifyWebApi instance
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
        console.log("erro")
    }
}

export async function GET(req, { params }) {
    const { id } = await params;

    const dd = await spotifyApi.clientCredentialsGrant();
    const token = dd.body["access_token"];
    spotifyApi.setAccessToken(token);

    const data = await spotifyApi.getTrack(id)

    const spotifyUrl = data.body.external_urls.spotify;
    console.log(spotifyUrl)

    const previewUrls = await getSpotifyLinks(spotifyUrl)

    console.log(previewUrls)

    return new Response(JSON.stringify({ data: previewUrls }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}