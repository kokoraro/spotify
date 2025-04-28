"use client";
import { BiPlus } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setArtists } from "@/app/redux/slices/artistSlice";
import { setCredential } from "@/app/redux/slices/authSlice";
import Loading from "./Loader";

function Sidebar() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const artists = useSelector((state) => state.artists.data);
	const fetched = useSelector((state) => state.artists.fetched);
	const [loading, setLoading] = useState("init");

	useEffect(() => {
		if (!token) {
			setLoading("auth");
			const fetchLogin = async () => {
				const res = await fetch("/api/login");
				const result = await res.json();

				dispatch(setCredential(result.token));
			};

			fetchLogin();
		} else if (!fetched) {
			setLoading("fetch");
			const fetchArtists = async () => {
				const res = await fetch(`/api/artists`); // Send the IDs as a query parameter
				const result = await res.json();
				dispatch(setArtists(result.data));
			};

			fetchArtists();
			setLoading("finish");
		}
	}, [token, dispatch, fetched]);

	return (
		<div className="min-w-[300px] w-[300px] relative">
			<div className="p-6 border-r-gray-800 border-r-2 pt-2 fixed min-w-[300px] w-[300px] h-full">
				<Link className="flex justify-center mb-4" href="/">
					<Image src="/logo.jpg" alt="Spotify" width={1757} height={752} className="w-[60%]" priority={true} />
				</Link>
				<div>
					<div className="flex justify-between border-b pb-2 border-b-slate-700">
						<h2 className="text-xl">My Favorite</h2>
					</div>
					{loading == "auth" ? <Loading title="Authenticating" /> : loading == "fetch" && <Loading title="Fetching Artists" />}

					{artists && artists.length > 0 && loading == "finish" && (
						<ul className="p-3 flex flex-col gap-2">
							{artists.map((item) => (
								<Link key={item.spotifyId} href={`/artist/${item.spotifyId}`}>
									{item.name}
								</Link>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
