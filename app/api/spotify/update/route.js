import Artist from "@/models/artistModel";
import State from "@/models/stateModel";
import spotifyApi from "../../spotify";
import Track from "@/models/trackModel";
import { getSpotifyLinks } from "@/utils";

export async function updateStates() {
	const credential = await spotifyApi.clientCredentialsGrant();
	const token = credential.body["access_token"];
	spotifyApi.setAccessToken(token);

	const artists = await Artist.find({});

	const states = await State.find({});

	let searchArray = [];
	for (const artist of artists) {
		const artistState = states.find((state) => state.artistId === artist.spotifyId);
		let albums;
		let startPoint = null;
		searchArray = [];

		console.log(startPoint, searchArray);

		if (artistState) {
			searchArray = artistState.albumId;
		} else {
			const albumsResponse = await spotifyApi.getArtistAlbums(artist.spotifyId, { limit: 50 });
			albums = albumsResponse.body.items;
			while (albumsResponse.body.next) {
				const nextResponse = await spotifyApi.getArtistAlbums(artist.spotifyId, { limit: 50, offset: albums.length });
				const nextAlbums = nextResponse.body.items;
				albums = [...albums, ...nextAlbums];
				albumsResponse.body = nextResponse.body;
			}
			albums = albums.filter((album) => artist.spotifyId != "0e11VHbS26W0oNGZflYPeL" || album.name.toLowerCase().includes("episode"));
			albums = albums.filter((album, index, self) => index === self.findIndex((a) => a.id === album.id));
			searchArray = albums.map((each) => each.id);
		}
		if (searchArray.length >= 3) {
			startPoint = searchArray[2];
		} else {
			startPoint = searchArray[searchArray.length - 1] || null;
		}
		const index = searchArray.indexOf(startPoint);
		const focusArray = searchArray.slice(0, index + 1);

		let tracksIds = [];

		console.log(startPoint, searchArray, focusArray);

		for (const id of focusArray) {
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
			tracksIds = filteredTracks.map((track) => track.id);

			filteredTracks = [];

			for (const trackId of tracksIds) {
				const trackRes = await spotifyApi.getTrack(trackId);
				const trackData = trackRes.body;

				const { id, name, duration_ms, track_number } = trackData;
				const external_urls = trackData.external_urls.spotify;

				let normalizedName = name.split("(")[0].trim();
				normalizedName = normalizedName.split("-")[0].trim();
				normalizedName = normalizedName.split("[")[0].trim();
				normalizedName = normalizedName.toCapitalize();
				if (keywords.some((keyword) => normalizedName.toLowerCase().includes(keyword))) continue;

				const preview_urls = await getSpotifyLinks(external_urls);
				const preview_url = preview_urls.length > 0 ? preview_urls[0] : "empty";

				const newTrackData = { artistId: artist.spotifyId, albumId: id, trackId, name: normalizedName, external_urls, duration_ms, track_number, preview_url };

				const existingTrack = await Track.findOne({ name: newTrackData.name });

				if (!existingTrack) {
					console.log("updated");
					const newTrack = new Track(newTrackData);
					await newTrack.save();
				} else {
					if (!existingTrack.albumId.includes(id)) {
						console.log("new album");
						existingTrack.albumId.push(id);
						await existingTrack.save();
					} else {
						console.log("exist");
					}
				}
			}
		}
		const newState = { artistId: artist.spotifyId, albumId: searchArray, time: new Date() };

		const existingState = await State.findOne({ artistId: artist.spotifyId });
		if (existingState) {
			existingState.albumId = tracksIds;
			existingState.time = new Date();
			await existingState.save();
		} else {
			const newData = new State(newState);
			await newData.save();
		}
	}

	return new Date();
}

export async function GET(req) {
	// const credential = await spotifyApi.clientCredentialsGrant();
	// const token = credential.body["access_token"];
	// spotifyApi.setAccessToken(token);

	// const artists = await Artist.find({});

	// const states = await State.find({});

	// for (const artist of artists) {
	// 	const artistState = states.find((state) => state.artistId === artist.spotifyId);
	// 	let albums;
	// 	let startPoint = null,
	// 		searchArray = [];
	// 	if (artistState) {
	// 		searchArray = artistState.albumId;
	// 	} else {
	// 		const albumsResponse = await spotifyApi.getArtistAlbums(artist.spotifyId, { limit: 50 });
	// 		albums = albumsResponse.body.items;
	// 		while (albumsResponse.body.next) {
	// 			const nextResponse = await spotifyApi.getArtistAlbums(artist.spotifyId, { limit: 50, offset: albums.length });
	// 			const nextAlbums = nextResponse.body.items;
	// 			albums = [...albums, ...nextAlbums];
	// 			albumsResponse.body = nextResponse.body;
	// 		}
	// 		albums = albums.filter((album) => artist.spotifyId != "0e11VHbS26W0oNGZflYPeL" || album.name.toLowerCase().includes("episode"));
	// 		albums = albums.filter((album, index, self) => index === self.findIndex((a) => a.id === album.id));
	// 		searchArray = albums.map((each) => each.id);
	// 	}

	// 	if (searchArray.length >= 3) {
	// 		startPoint = searchArray[2];
	// 	} else {
	// 		startPoint = searchArray[searchArray.length - 1] || null;
	// 	}
	// 	const index = searchArray.indexOf(startPoint);
	// 	const focusArray = searchArray.slice(0, index + 1);

	// 	let tracksIds = [];

	// 	for (const id of focusArray) {
	// 		console.log(id);
	// 		let tracksResponse = await spotifyApi.getAlbumTracks(id, { offset: 0 });
	// 		let tracks = [];

	// 		while (tracksResponse.body.next) {
	// 			tracksResponse = await spotifyApi.getAlbumTracks(id, { offset: tracks.length });
	// 			tracks.push(...tracksResponse.body.items);
	// 		}

	// 		// Filter longer than 2mins
	// 		let filteredTracks = tracks.filter((track) => track.duration_ms >= 120000);

	// 		// Filter excluding strings
	// 		const keywords = ["outro", "intro", "upcoming", "shout outs"];

	// 		// Extract Track IDs only
	// 		tracksIds = filteredTracks.map((track) => track.id);

	// 		console.log(tracksIds);

	// 		filteredTracks = [];

	// 		for (const trackId of tracksIds) {
	// 			const trackRes = await spotifyApi.getTrack(trackId);

	// 			console.log(trackRes);
	// 			const trackData = trackRes.body;

	// 			const { id, name, duration_ms, track_number } = trackData;
	// 			const external_urls = trackData.external_urls.spotify;

	// 			let normalizedName = name.split("(")[0].trim();
	// 			normalizedName = normalizedName.split("-")[0].trim();
	// 			normalizedName = normalizedName.split("[")[0].trim();
	// 			normalizedName = normalizedName.toCapitalize();
	// 			if (keywords.some((keyword) => normalizedName.toLowerCase().includes(keyword))) continue;

	// 			const preview_urls = await getSpotifyLinks(external_urls);
	// 			const preview_url = preview_urls.length > 0 ? preview_urls[0] : "empty";

	// 			const newTrackData = { artistId: artist.spotifyId, albumId: id, trackId, name: normalizedName, external_urls, duration_ms, track_number, preview_url };

	// 			const existingTrack = await Track.findOne({ name: newTrackData.name });

	// 			if (!existingTrack) {
	// 				const newTrack = new Track(newTrackData);
	// 				await newTrack.save();
	// 			} else {
	// 				if (!existingTrack.albumId.includes(id)) {
	// 					existingTrack.albumId.push(id);
	// 					await existingTrack.save();
	// 				}
	// 			}
	// 		}
	// 	}
	// 	const newState = { artistId: artist.spotifyId, albumId: searchArray, time: new Date() };

	// 	const existingState = await State.findOne({ artistId: artist.spotifyId });
	// 	if (existingState) {
	// 		existingState.albumId = tracksIds;
	// 		existingState.time = new Date();
	// 		await existingState.save();
	// 	} else {
	// 		const newData = new State(newState);
	// 		await newData.save();
	// 	}
	// }

	const res = await updateStates();

	return new Response(JSON.stringify({ data: new Date() }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
