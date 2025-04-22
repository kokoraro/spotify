import spotifyApi from "../spotify"; // Import the shared SpotifyWebApi instance

export async function GET(req) {
    const dd = await spotifyApi.clientCredentialsGrant();
    const token = dd.body["access_token"];
    spotifyApi.setAccessToken(token);
    const url = new URL(req.url);
    const artistId = url.searchParams.get("artist")

    if (!artistId) {
        return new Response(JSON.stringify({ error: "No artist IDs provided" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const albumsResponse = await spotifyApi.getArtistAlbums(artistId, { limit: 50 });
    let albums = albumsResponse.body.items;

    albums = albums.filter(album => artistId != '0e11VHbS26W0oNGZflYPeL' || album.name.toLowerCase().includes("episode"));

    const uniqueAlbumIds = new Set(albums.map(album => album.id));

    while (albumsResponse.body.next) {
        const nextResponse = await spotifyApi.getArtistAlbums(artistId, { limit: 50, offset: albums.length });
        const nextAlbums = nextResponse.body.items;

        const filteredNextAlbums = nextAlbums.filter(album => artistId != '0e11VHbS26W0oNGZflYPeL' || album.name.toLowerCase().includes("episode"));

        filteredNextAlbums.forEach(album => {
            if (!uniqueAlbumIds.has(album.id)) {
                albums.push(album);
                uniqueAlbumIds.add(album.id);
            }
        });

        albumsResponse.body = nextResponse.body;
    }

    albums = albums.filter((album, index, self) =>
        index === self.findIndex((a) => a.id === album.id)
    );

    return new Response(JSON.stringify({ data: albums }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
