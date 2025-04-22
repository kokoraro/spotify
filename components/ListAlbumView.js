import Image from "next/image";
import Link from "next/link";

const ListAlbumView = ({ title, image, date, songs, id }) => {
	return (
		<Link className="px-2 py-3 flex gap-4 hover:shadow-[0px_0px_8px_4px_#02d95667] duration-500 cursor-pointer rounded-md" href={{ pathname: "/album/" + id }}>
			<Image src={image.url} width={image.width} height={image.height} alt={title} className="w-[100px] aspect-square rounded-md" />
			<div className="flex justify-center flex-col">
				<h1 className="text-2xl">{title}</h1>
				<h2 className="text-md">
					Album • {new Date(date).getFullYear()} • {songs} {songs < 2 ? "song" : "songs"}
				</h2>
			</div>
		</Link>
	);
};

export default ListAlbumView;
