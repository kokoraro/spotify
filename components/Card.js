import Link from "next/link";

const Card = ({ title, link }) => {
	return (
		<Link
			className="rounded-3xl flex shadow p-10 shadow-green-400 w-full cursor-pointer h-full justify-center items-center text-center text-xl hover:shadow-lg border border-transparent hover:border-[#00c95056] duration-300 hover:shadow-green-600"
			href={'/artist/'+link}
		>
			{title}
		</Link>
	);
};

export default Card;
