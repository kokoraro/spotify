"use client";

import Loading from "@/components/Loader";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setArtists } from "../redux/slices/artistSlice";

const Admin = () => {
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [artistId, setArtistId] = useState("");
	const [stage, setStage] = useState("init");
	const [readAlbum, setReadAlbum] = useState(0);
	const [totalAlbums, setTotalAlbums] = useState(0);
	const [going, setGoing] = useState(false);
	// const [from, setFrom] = useState(0);
	// const [until, setUntil] = useState(0);

	const artists = useSelector((state) => state.artists.data);

	const handleAddClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const addNewArtist = async () => {
		setReadAlbum(0);
		setIsModalOpen(false);
		if (artistId && artistId != "") {
			setStage("fetch_albums");
			const res = await fetch(`/api/spotify/artists?id=${artistId}`);
			const data = await res.json();
			const albumIds = data.data;

			console.log(albumIds);
			setStage("fetch_tracks");
			setTotalAlbums(albumIds.length);
			for (const id of albumIds) {
				console.log(artistId, id);
				setReadAlbum((prev) => prev + 1);
				if (readAlbum < from) continue;
				const res = await fetch(`/api/spotify/albums?id=${id}&artistid=${artistId}`);
			}
			setReadAlbum(0);
			setStage("init");
		} else {
			toast("Invalid Artist Id");
		}
		setArtistId("");
	};

	const updateList = async () => {
		setGoing(true);
		// Fetch current Artists List
		// const res = await fetch(`/api/artists`);
		// const data = await res.json();
		// const artists = data?.data;

		// Get updated Artists Data
		// const artistIds = artists.map((artist) => artist.spotifyId);

		// Get the Last Update State
		const updated = await fetch("/api/spotify/update");
		const stateRes = await updated.json();
		const updatedState = stateRes?.data;
		console.log(updatedState);
		toast("Successfully Updated");

		// for (const artistId of artistIds) {
		// 	const lastArtistState = updatedState.find((item) => item.artistId === artistId);
		// 	setStage("fetch_albums");
		// 	const res = await fetch(`/api/spotify/artists?id=${artistId}`);
		// 	const data = await res.json();
		// 	const albumIds = data.data;

		// 	console.log(albumIds);
		// 	console.log(lastArtistState);

		// 	let startPoint = null;

		// 	if (lastArtistState && lastArtistState.length > 0) {
		// 		console.log("here");
		// 		if (lastArtistState.length >= 3) startPoint = lastArtistState[2];
		// 		else startPoint = lastArtistState[lastArtistState.length - 1];
		// 	} else {
		// 		console.log("dkjh");
		// 		if (lastArtistState.length >= 3) startPoint = lastArtistState[2];
		// 		else startPoint = lastArtistState[lastArtistState.length - 1];
		// 	}

		// 	console.log(startPoint);
		// 	// setStage("fetch_tracks");
		// 	// setTotalAlbums(albumIds.length);
		// 	// for (const id of albumIds) {
		// 	// 	setReadAlbum((prev) => prev + 1);
		// 	// 	const res = await fetch(`/api/spotify/albums?id=${id}&artistid=${artistId}`);
		// 	// }
		// 	// setReadAlbum(0);
		// 	setStage("init");
		// }
		setGoing(false);
	};

	return (
		<div className="p-20 w-full">
			<h1 className="text-4xl mb-5">Settings</h1>
			<div className="pl-10 w-full flex flex-col gap-5">
				<div>
					<h2 className="text-2xl pb-3 border-b border-b-[#01793456]">Channel</h2>
					<div className="flex gap-12 p-8 flex-wrap">
						{artists.map((artist) => (
							<div key={artist.spotifyId} className="w-48 rounded-md h-62 flex border-2 shadow-lg shadow-green-700 border-gray-500 flex-col gap-3 cursor-pointer">
								<Image
									src={artist.images[0].src}
									alt="No Preview"
									width={artist.images[0].width}
									height={artist.images[0].height}
									className="w-full aspect-square rounded-t-md border-b border-[#12c95664]"
								/>
								<h1 className="text-center">{artist.name}</h1>
							</div>
						))}
						<div className="w-48 rounded-md h-62 flex justify-center items-center border-dashed border-2 border-gray-500 flex-col gap-3 cursor-pointer" onClick={handleAddClick}>
							{stage == "init" ? (
								<>
									<button>
										<AiOutlinePlus size={24} />
									</button>
									<p> Add New </p>
								</>
							) : stage === "fetch_albums" ? (
								<h1>
									<Loading title={"Fetching Albums"} />
								</h1>
							) : stage === "fetch_tracks" ? (
								<h1>
									{" "}
									{/* <Loading title={`${readAlbum} of ${totalAlbums} Albums`} /> */}
									<Loading title={`Fetching ${totalAlbums} Albums`} />
								</h1>
							) : (
								<>Hello</>
							)}
						</div>
					</div>
				</div>
				<div>
					<h2 className="text-2xl pb-3 border-b border-b-[#01793456]">Update</h2>
					<div className="flex gap-4 p-8 flex-col text-xl">
						<h2>Last Update : {"1 day ago"}</h2>
						<div className="flex w-fit items-center gap-3">
							<h2>Schedule : </h2>
							{/* <select className="bg-black p-1 border-b border-b-[#01793456] outline-0"> */}
							<div>Weekly</div>
							{/* <option value="day">1 Day</option> */}
							{/* </select> */}
						</div>
						<div className="ml-auto mr-8 flex gap-6">
							{/* <button className="rounded-md px-8 py-2 bg-[#017934] cursor-pointer">Save</button> */}
							<button className="rounded-md py-2 bg-[#017934] duration-500 cursor-pointer w-[200px] shadow-green-700 shadow hover:shadow-blue-500 hover:bg-blue-500" onClick={updateList}>
								{going ? "Updating..." : "Update Now"}
							</button>
						</div>
					</div>
				</div>
			</div>
			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<div className="p-4">
					<h1 className="mb-3 text-xl">New Channel</h1>
					<input type="text" name="channel" className="p-1 border rounded-sm" value={artistId} onChange={(e) => setArtistId(e.target.value)} />
					<button type="button" className="bg-[#017934] cursor-pointer px-3 py-2 rounded ml-4" onClick={addNewArtist}>
						Add New
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default Admin;
