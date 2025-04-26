"use client";
import { formatDuration } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { BiPauseCircle, BiPlayCircle } from "react-icons/bi";

const AllSongs = ({ artistId }) => {
	const [tracks, setTracks] = useState([]);
	const [playing, setPlaying] = useState(false);
	const [activeTrack, setActiveTrack] = useState(null);
	const [hoverTrack, setHoverTrack] = useState(null);
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
		const fetchTracks = async () => {
			const response = await fetch("/api/tracks?artist=" + artistId);
			const res = await response.json();

			setTracks(res.data);
		};

		fetchTracks();
	}, []);

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

	return (
		<div>
			<div className="flex border-b border-[#01782364] mb-3 pb-2">
				<h1 className="w-1/24 text-center">#</h1>
				<h1 className="w-5/6">Title</h1>
				<h2 className="w-1/8">Duration</h2>
			</div>
			{tracks &&
				tracks.length > 0 &&
				tracks.map((track, idx) => (
					<div
						key={track.trackId}
						className="flex py-4 hover:bg-slate-700 duration-500 items-center rounded"
						onMouseEnter={() => setHoverTrack(track)}
						onMouseLeave={() => setHoverTrack(null)}
					>
						<div className="w-1/24 flex items-center justify-center">
							<button className="cursor-pointer" onClick={() => togglePlay(track)}>
								{!(activeTrack?.trackId === track.trackId || (hoverTrack && hoverTrack?.trackId === track.trackId)) ? (
									<h1>{idx + 1}</h1>
								) : playing ? (
									<BiPauseCircle size={24} className={`text-white`} color={`${activeTrack?.trackId === track.trackId ? "green" : "white"}`} />
								) : (
									<BiPlayCircle size={24} className={`text-white`} color={`${activeTrack?.trackId === track.trackId ? "green" : "white"}`} />
								)}
							</button>
						</div>
						<h1 className={`w-5/6 ${activeTrack?.trackId === track.trackId && "text-green-500"}`}>{track.name}</h1>
						{/* onMouseEnter={() => previewSong(track)} */}
						<h1 className="w-1/8">{formatDuration(track.duration_ms)}</h1>
					</div>
				))}
		</div>
	);
};

export default AllSongs;
