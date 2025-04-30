import Link from "next/link";
import React from "react";

const Home = () => {
	return (
		<div className="flex h-full w-full justify-center flex-col gap-12 items-center">
			<div className="rounded-md p-8 border shadow-md">
				My Upwork account is currently blocked. I am in touch with the Upwork support team to resolve the issue. <br />
				In the meantime, please feel free to email me so I can hand over my work. Here is my github email. <br />
				<h2 className="text-2xl text-center mt-5">oleksandrkhomenko57@gmail.com</h2>
			</div>

			<Link href="/main" className="px-5 rounded-md py-2 bg-green-600">
				Go to the main page
			</Link>
		</div>
	);
};

export default Home;
