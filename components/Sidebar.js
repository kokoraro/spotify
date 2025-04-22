"use client";
import { BiPlus } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setArtists } from "@/app/redux/slices/artistSlice";
import { setCredential } from "@/app/redux/slices/authSlice";

function Sidebar() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const artists = useSelector((state) => state.artists.data);

	useEffect(() => {
		if (!token) {
			const fetchLogin = async () => {
				const res = await fetch("/api/login");
				const result = await res.json();

				dispatch(setCredential(result.token));
			};

			fetchLogin();
		} else if (!artists || artists.length == 0) {
			const fetchArtists = async () => {
				const artistIds = "25mFVpuABa9GkGcj9eOPce,0e11VHbS26W0oNGZflYPeL,2hL1EouqXLtBEB6JKnPF0h"; // Replace with actual artist IDs
				const res = await fetch(`/api/artists?ids=${artistIds}`); // Send the IDs as a query parameter
				const result = await res.json();
				dispatch(setArtists(result.data));
			};

			fetchArtists();
		}
	}, [token, dispatch, artists]);

	return (
		<div className="min-w-[300px] w-[300px] relative">
			<div className="p-6 border-r-gray-800 border-r-2 pt-2 fixed min-w-[300px] w-[300px] h-full">
				<Link className="flex justify-center mb-4" href="/">
					<Image src="/logo.jpg" alt="Spotify" width={1757} height={752} className="w-[60%]" />
				</Link>
				<div>
					<div className="flex justify-between border-b pb-2 border-b-slate-700">
						<h2 className="text-xl">My Favorite</h2>
						<button>
							<BiPlus size={24} />
						</button>
					</div>

					{artists && artists.length > 0 && (
						<ul className="p-3 flex flex-col gap-2">
							{artists.map((item) => (
								<Link key={item.id} href={`/artist/${item.id}`}>
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
