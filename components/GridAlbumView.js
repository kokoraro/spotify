import Image from "next/image"
import Link from "next/link"

const GridAlbumView = ({ image, title, date, songs, id }) => {
    return (
        <Link className="w-full rounded-md shadow-green-600 shadow-sm cursor-pointer hover:shadow-lg duration-500" href={{ pathname: '/album/' + id }}>
            <Image src={image.url} width={image.width} height={image.height} alt={title} className="w-full aspect-square rounded-t-md" />
            <div className="py-3 px-4">
                <h1 className="text-xl">{title}</h1>
                <h2 className="text-md">Album • {new Date(date).getFullYear()} • {songs} songs</h2>
            </div>
        </Link>
    )
}

export default GridAlbumView