"use client";
import Card from "@/components/Card";
import { useSelector } from "react-redux";

function Home() {
	const artists = useSelector(state => state.artists.data)
	return (
		<div className="flex flex-col w-full p-5 px-20">
			<div className="mt-10 flex justify-center text-2xl pb-10 border-b border-b-slate-800">My Favorite Artists</div>
			<div className="flex justify-between mt-20 mx-10">
				{artists && artists.length > 0 && artists.map((item, index) => (
					<div className="w-1/5" key={index}>
						<Card title={item?.name} link={item?.id} />
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
