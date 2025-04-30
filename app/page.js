import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillCheckCircle, AiFillWarning } from "react-icons/ai";

const Home = () => {
	return (
		<div className="flex h-full w-full justify-center flex-col gap-12 items-center">
			<div className="rounded-md p-8 border shadow-md">
				<div className="flex justify-center mb-5 ">
					<AiFillCheckCircle size={32} className="text-green-500" />
					<h1 className="text-xl ml-5">Ready to submit my work</h1>
				</div>
				My Upwork account is currently blocked. I am in touch with the Upwork support team to resolve the issue. <br />
				In the meantime, please feel free to email me so I can submit my work. Here is my github email. <br />
				<h2 className="text-2xl text-center mt-5">oleksandrkhomenko57@gmail.com</h2>
				<h2 className="text-md text-center mt-3">
					(Telegram:{" "}
					<Link href="https://t.me/olexk57" className="underline">
						@olexk57
					</Link>
					)
				</h2>
			</div>

			<div className="flex gap-10">
				<div className="rounded-lg shadow-green-400 border shadow-md">
					<Image src="/3profiles.jpg" alt="3 Profiles" width={733} height={914} className="rounded-t-lg w-60 h-60" />
					<div className="py-3 px-4 border-t text-center">Added All Profiles</div>
				</div>
				<div className="rounded-lg shadow-green-400 border shadow-md">
					<Image src="/deduplicate.jpg" alt="3 Profiles" width={733} height={914} className="rounded-t-lg w-60 h-60" />
					<div className="py-3 px-4 border-t text-center">De-duplicate Tracks</div>
				</div>
				<div className="rounded-lg shadow-green-400 border shadow-md">
					<div className="w-60 h-60 flex">
						<Image src="/normal.jpg" alt="3 Profiles" width={733} height={914} className="rounded-t-lg w-60 h-40 my-auto" />
					</div>
					<div className="py-3 px-4 border-t text-center">Normalize Name</div>
				</div>
				<div className="rounded-lg shadow-green-400 border shadow-md">
					<div className="w-60 h-60 flex">
						<Image src="/update.jpg" alt="3 Profiles" width={733} height={104} className="w-60 h-10 my-auto" />
					</div>
					<div className="py-3 px-4 border-t text-center">Weekly Updates</div>
				</div>
			</div>
			<Link href="/main" className="px-5 rounded-md py-2 bg-green-600 shadow-md shadow-green-400">
				Go to the main page
			</Link>
		</div>
	);
};

export default Home;
