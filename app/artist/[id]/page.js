"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart } from "react-icons/ai";
import { formatFollowers } from "@/utils";
import { RiAlbumLine } from "react-icons/ri";
import { BiListUl } from "react-icons/bi";
import { BiGridAlt } from "react-icons/bi";
import GridAlbumView from "@/components/GridAlbumView";
import ListAlbumView from "@/components/ListAlbumView";
import { setAlbums } from "@/app/redux/slices/albumSlice";
import AllSongs from "@/components/AllSongs";
import Loading from "@/components/Loader";

const ArtistPage = ({ params }) => {
	const [view, setView] = useState("grid");
	const { id } = React.use(params);
	const artist = useSelector((state) => state.artists.data.find((artist) => artist.spotifyId === id));
	const albums = useSelector((state) => state.albums.data);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!!id) {
			console.log(id);
			const fetchAlbum = async (id) => {
				const res = await fetch("/api/albums?artist=" + id);
				const data = await res.json();

				dispatch(setAlbums(data.data));
			};

			setLoading(true);
			fetchAlbum(id);
			setLoading(false);
		}
	}, [id, dispatch]);

	return (
		<div className="p-10 w-full">
			<div className={`flex border-green-700 w-full pb-4 items-end ${view !== "all" ? "border-b" : "border-transparent"}`}>
				{artist && (
					<div className="flex">
						<Image
							src={artist?.images[0]?.src}
							alt={artist?.name}
							width={artist?.images[0].width}
							height={artist?.images[0].height}
							className="w-[150px] h-[150px] rounded-xl border border-slate-600"
							priority={false}
						/>
						<div className="p-5">
							<h1 className="text-4xl">{artist?.name}</h1>
							<div className="flex gap-2 items-center mt-3">
								<RiAlbumLine color="green" />
								<h2>{albums?.length} Albums</h2>
							</div>
							<div className="flex gap-2 items-center mt-3">
								<AiFillHeart color="red" />
								<h2>{formatFollowers(artist?.follower)}</h2>
							</div>
						</div>
					</div>
				)}
				<div className="ml-auto mr-10 flex gap-3">
					<button className="cursor-pointer" onClick={() => setView("grid")}>
						<BiGridAlt size={24} />
					</button>
					<button className="cursor-pointer" onClick={() => setView("list")}>
						<BiListUl size={24} />
					</button>
					<button className="rounded-md border border-green-700 py-2 px-5 cursor-pointer" onClick={() => setView("all")}>
						All Songs
					</button>
				</div>
			</div>
			{!loading && albums && albums.length > 0 && view !== "all" ? (
				<div className={`${view == "grid" ? "grid grid-cols-6 gap-10" : "flex flex-col gap-5"} mt-10`}>
					{albums.map((album) =>
						view === "grid" ? (
							<GridAlbumView
								id={album.albumId}
								key={album.albumId} // Move key prop here
								title={album.name}
								image={album.images[0]} // Ensure correct property access
								date={album.release_date}
								songs={album.total_tracks}
							/>
						) : (
							// Fixed typo here
							<ListAlbumView
								id={album.albumId}
								key={album.albumId} // Move key prop here
								title={album.name}
								image={album.images[0]} // Ensure correct property access
								date={album.release_date}
								songs={album.total_tracks}
							/>
						)
					)}
				</div>
			) : (
				!loading && artist && albums.length > 0 && <AllSongs artistId={artist.spotifyId} />
			)}
			{loading && <Loading />}
		</div>
	);
};

export default ArtistPage;
