import connectDB from "@/utils/db";
import spotifyApi from "../../spotify";
import Artist from "@/models/artistModel";

export async function GET(req) {
    const credential = await spotifyApi.clientCredentialsGrant();
    const token = credential.body["access_token"];
    spotifyApi.setAccessToken(token);

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    let data = await spotifyApi.getArtist(id);

    const item = data.body

    const follower = item.followers.total
    const { id: spotifyId, name, popularity } = item
    const { url: src, height, width } = item?.images[0]

    const image = { src, height, width }

    const albumsResponse = await spotifyApi.getArtistAlbums(item.id, { limit: 50 });
    let albums = albumsResponse.body.items;

    while (albumsResponse.body.next) {
        const nextResponse = await spotifyApi.getArtistAlbums(item.id, { limit: 50, offset: albums.length });
        const nextAlbums = nextResponse.body.items;

        albums = [...albums, ...nextAlbums];

        albumsResponse.body = nextResponse.body;
    }

    // Album filter
    albums = albums.filter(album => item.id != '0e11VHbS26W0oNGZflYPeL' || album.name.toLowerCase().includes("episode"));

    albums = albums.filter((album, index, self) =>
        index === self.findIndex((a) => a.id === album.id)
    );

    const albumsIds = albums.map(album => album.id)

    const total_albums = albums.length;

    await connectDB();

    const existingArtist = await Artist.findOne({ spotifyId })

    const newArtist = { spotifyId, name, total_albums, popularity, images: [image], follower }

    if (!existingArtist) {
        const artist = new Artist(newArtist)

        try {
            await artist.save();
        } catch (error) {
            console.error("Error saving artist:", error);
        }
    }

    return new Response(JSON.stringify({ data: albumsIds }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    })
}
