import spotifyApi from "../../spotify";
import Track from "@/models/trackModel";
import Album from "@/models/albumModel";
import { getSpotifyLinks } from "@/utils";

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
	const { url: src, height, width } = albumData.images[0];
	const spotify_url = albumData.external_urls.spotify;
	const image = { src, height, width };
	const newAlbum = { artistId, albumId, total_tracks, name, release_date, popularity, images: [image], spotify_url };

	const existingAlbum = await Album.findOne({ albumId });
	if (!existingAlbum) {
		const album = new Album(newAlbum);
		await album.save();

		let tracksResponse = await spotifyApi.getAlbumTracks(id);
		let tracks = tracksResponse.body.items;

		while (tracksResponse.body.next) {
			tracksResponse = await spotifyApi.getAlbumTracks(id, { offset: tracks.length });
			tracks.push(...tracksResponse.body.items);
		}

		// Filter longer than 2mins
		let filteredTracks = tracks.filter((track) => track.duration_ms >= 120000);

		// Filter excluding strings
		const keywords = ["outro", "intro", "upcoming", "shout outs"];

		// Extract Track IDs only
		const tracksIds = filteredTracks.map((track) => track.id);

		filteredTracks = [];

		for (const trackId of tracksIds) {
			const trackRes = await spotifyApi.getTrack(trackId);
			const trackData = trackRes.body;

			const { id, name, duration_ms, track_number } = trackData;
			const external_urls = trackData.external_urls.spotify;

			let normalizedName = name.split("(")[0].trim();
			normalizedName = normalizedName.split("-")[0].trim();
			if (keywords.some((keyword) => normalizedName.toLowerCase().includes(keyword))) continue;

			console.log(normalizedName);

			const preview_urls = await getSpotifyLinks(external_urls);
			const preview_url = preview_urls?.length > 0 ? preview_urls[0] : "empty";

			const newTrackData = { artistId, albumId, trackId: id, name: normalizedName, external_urls, duration_ms, track_number, preview_url };

			const existingTrack = await Track.findOne({ name: newTrackData.name });

			if (!existingTrack) {
				const newTrack = new Track(newTrackData);
				await newTrack.save();
			}
		}

		return new Response(JSON.stringify({ data: albumData }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} else if (existingAlbum) {
		if (existingAlbum.total_tracks == total_tracks) {
			existingAlbum.release_date = release_date;
			existingAlbum.popularity = popularity;

			await existingAlbum.save();
			return new Response(JSON.stringify({ data: existingAlbum }), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		} else {
			existingAlbum.release_date = release_date;
			existingAlbum.popularity = popularity;
			existingAlbum.total_tracks = total_tracks;

			await existingAlbum.save();

			let tracksResponse = await spotifyApi.getAlbumTracks(id);
			let tracks = [];

			while (tracksResponse.body.next) {
				tracksResponse = await spotifyApi.getAlbumTracks(id, { offset: tracks.length });
				tracks.push(...tracksResponse.body.items);
			}

			// Filter longer than 2mins
			let filteredTracks = tracks.filter((track) => track.duration_ms >= 120000);

			// Filter excluding strings
			const keywords = ["outro", "intro", "upcoming", "shout outs"];

			// Extract Track IDs only
			const tracksIds = filteredTracks.map((track) => track.id);

			filteredTracks = [];

			for (const trackId of tracksIds) {
				const trackRes = await spotifyApi.getTrack(trackId);
				const trackData = trackRes.body;

				const { id, name, duration_ms, track_number } = trackData;
				const external_urls = trackData.external_urls.spotify;

				let normalizedName = name.split("(")[0].trim();
				normalizedName = normalizedName.split("-")[0].trim();
				if (keywords.some((keyword) => normalizedName.toLowerCase().includes(keyword))) continue;

				console.log(normalizedName);

				const preview_urls = await getSpotifyLinks(external_urls);
				const preview_url = preview_urls.length > 0 ? preview_urls[0] : "empty";

				const newTrackData = { artistId, albumId, trackId: id, name: normalizedName, external_urls, duration_ms, track_number, preview_url };

				const existingTrack = await Track.findOne({ name: newTrackData.name });

				if (!existingTrack) {
					const newTrack = new Track(newTrackData);
					await newTrack.save();
				}
			}

			return new Response(JSON.stringify({ data: existingAlbum }), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
	}
}
