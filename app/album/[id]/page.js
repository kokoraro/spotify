"use client";
import { formatDuration } from "@/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiPlayCircle, BiPauseCircle } from "react-icons/bi";

const Page = ({ params }) => {
	const { id } = React.use(params);
	const [album, setAlbum] = useState(null);
	const [tracks, setTracks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [playing, setPlaying] = useState(false);

	const previewSong = async (track) => {
		const spotifyUrl = track.external_urls.spotify;
		const res = await fetch("/api/tracks/" + track.id);
		const data = await res.json();
		const audio = new Audio(data.data);
		setPlaying(true);
		audio.play();

		audio.addEventListener("ended", () => {
			setPlaying(false);
		});
	};

	const playSong = (track) => {
		console.log("hello");
	};

	useEffect(() => {
		const fetchAlbum = async () => {
			try {
				const res = await fetch(`/api/albums/${id}`);
				if (res.ok) {
					const data = await res.json();
					console.log(data);
					setAlbum(data.data);
					setTracks(data.tracks);
				} else {
					console.error("Album not found");
				}
			} catch (error) {
				console.error("Error fetching album:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAlbum(); // Call the fetch function
	}, [id]); // Dependency array to run effect when ID changes

	if (loading) return <div>Loading...</div>; // Handle loading state

	if (!album) return <div>Album not found</div>; // Handle not found case

	return (
		<div className="p-10 w-full">
			<div className="px-2 pt-3 pb-5 flex gap-4 w-full">
				<Image src={album.images[0].url} width={album.images[0].width} height={album.images[0].height} alt={album.name} className="w-[150px] aspect-square rounded-md" priority={true} />
				<div className="flex justify-center flex-col gap-4">
					<h1 className="text-3xl">{album.name}</h1>
					<h2 className="text-md">
						Album • {new Date(album.release_date).getFullYear()} • {album.total_tracks} {album.total_tracks < 2 ? "song" : "songs"}
					</h2>
					<button className="cursor-pointer">
						<BiPlayCircle size={32} className="text-white duration-500 hover:text-green-300" />
					</button>
				</div>
			</div>
			<div>
				<div className="flex border-b border-[#01782364] mb-3">
					<h1 className="w-1/24 text-center">#</h1>
					<h1 className="w-5/6">Title</h1>
					<h2 className="w-1/8">Duration</h2>
				</div>
				{tracks.map((track) => (
					<div key={track.id} className="flex py-4 hover:bg-slate-700 duration-500 items-center rounded">
						<div className="w-1/24 flex items-center justify-center">
							<button className="cursor-pointer" onClick={() => previewSong(track)}>
								{playing ? <BiPauseCircle size={24} className="text-white" /> : <BiPlayCircle size={24} className="text-white" />}
							</button>
						</div>
						<h1 className="w-5/6">{track.name}</h1>
						{/* onMouseEnter={() => previewSong(track)} */}
						<h1 className="w-1/8">{formatDuration(track.duration_ms)}</h1>
					</div>
				))}
				<div className="py-4"></div>
			</div>
		</div>
	);
};

export default Page;
