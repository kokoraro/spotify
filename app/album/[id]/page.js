"use client";
import Loading from "@/components/Loader";
import { formatDuration } from "@/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BiPlayCircle, BiPauseCircle } from "react-icons/bi";

const Page = ({ params }) => {
	const { id } = React.use(params);
	const [album, setAlbum] = useState(null);
	const [tracks, setTracks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [playing, setPlaying] = useState(false);
	const [activeTrack, setActiveTrack] = useState(null);
	const audioRef = useRef(null);

	const togglePlay = (track) => {
		if (activeTrack !== track) {
			setActiveTrack(track);
			setPlaying(true);
		} else {
			setPlaying((prev) => !prev); // Toggle play/pause
		}
	};

	useEffect(() => {
		if (activeTrack) {
			audioRef.current = new Audio(activeTrack.preview_url);

			if (playing) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}

			return () => {
				audioRef.current.pause();
				audioRef.current = null;
			};
		}
	}, [activeTrack, playing]);

	useEffect(() => {
		if (audioRef.current) {
			if (playing) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [playing]);

	useEffect(() => {
		const fetchAlbum = async () => {
			try {
				const res = await fetch(`/api/albums/${id}`);
				const data = await res.json();
				console.log(data.data);
				setAlbum(data.data);

				const trackRes = await fetch(`/api/tracks/${id}`);
				const trackData = await trackRes.json();
				console.log(trackData.data);
				setTracks(trackData.data);
			} catch (error) {
				console.error("Error fetching album:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAlbum();
	}, [id]);

	if (loading)
		return (
			<div className="flex justify-center items-center w-full">
				<Loading title="Loading Tracks" />
			</div>
		);

	if (!album) return <div>Album not found</div>;

	return (
		<div className="p-10 w-full">
			<div className="px-2 pt-3 pb-5 flex gap-4 w-full">
				<Image src={album.images[0].src} width={album.images[0].width} height={album.images[0].height} alt={album.name} className="w-[150px] aspect-square rounded-md" priority={true} />
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
					<div key={track.trackId} className="flex py-4 hover:bg-slate-700 duration-500 items-center rounded">
						<div className="w-1/24 flex items-center justify-center">
							<button className="cursor-pointer" onClick={() => togglePlay(track)}>
								{playing && activeTrack?.trackId === track.trackId ? (
									<BiPauseCircle size={24} className={`text-white`} color={`${activeTrack?.trackId === track.trackId ? "green" : "white"}`} />
								) : (
									<BiPlayCircle size={24} className={`text-white`} color={`${activeTrack?.trackId === track.trackId ? "green" : "white"}`} />
								)}
							</button>
						</div>
						<h1 className={`w-5/6 ${activeTrack?.trackId === track.trackId && "text-green-500"}`}>{track.name}</h1>

						<h1 className="w-1/8">{formatDuration(track.duration_ms)}</h1>
					</div>
				))}
				<div className="py-4"></div>
			</div>
		</div>
	);
};

export default Page;
