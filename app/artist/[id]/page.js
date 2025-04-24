"use client";
import { setAlbums } from "@/app/redux/slices/artistSlice";
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

const ArtistPage = ({ params }) => {
	const [view, setView] = useState("grid");
	const { id } = React.use(params);
	const artist = useSelector((state) => state.artists.data.find((artist) => artist.id === id));
	const dispatch = useDispatch();

	const hasAlbums = artist?.album?.length > 0;

	useEffect(() => {
		if (!hasAlbums) {
			const fetchAlbum = async (id) => {
				const res = await fetch("/api/albums?artist=" + id);
				const data = await res.json();
				dispatch(setAlbums({ artistId: id, albums: data.data }));
			};

			fetchAlbum(id);
		}
	}, [id, hasAlbums, dispatch]);

	return (
		<div className="p-10 w-full">
			<div className="flex border-b border-green-700 w-full pb-4 items-end">
				{artist && (
					<div className="flex">
						<Image
							src={artist?.images[0]?.url}
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
								<h2>{artist?.albums?.length} Albums</h2>
							</div>
							<div className="flex gap-2 items-center mt-3">
								<AiFillHeart color="red" />
								<h2>{formatFollowers(artist?.followers.total)}</h2>
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
			{artist && artist.albums && artist.albums.length > 0 ? (
				<div className={`${view == "grid" ? "grid grid-cols-6 gap-10" : "flex flex-col gap-5"} mt-10`}>
					{artist.albums.map((album) =>
						view === "grid" ? (
							<GridAlbumView
								id={album.id}
								key={album.id} // Move key prop here
								title={album.name}
								image={album.images[0]} // Ensure correct property access
								date={album.release_date}
								songs={album.total_tracks}
							/>
						) : view === "list" ? ( // Fixed typo here
							<ListAlbumView
								id={album.id}
								key={album.id} // Move key prop here
								title={album.name}
								image={album.images[0]} // Ensure correct property access
								date={album.release_date}
								songs={album.total_tracks}
							/>
						) : (
							<h1 key={album.id}>All Songs</h1>
						)
					)}
				</div>
			) : (
				<h1>No Albums</h1>
			)}
		</div>
	);
};

export default ArtistPage;
