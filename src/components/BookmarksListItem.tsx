import { Bookmark } from "../types";

const BookmarksListItem = ({ bookmark }: { bookmark: Bookmark }) => {
    const {
        url,
        title,
        dateAdded,
        originalTitle,
        type,
        image,
        originalImage,
        author
    } = bookmark;
    const date = new Date(dateAdded);

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (originalImage && (event.target as HTMLImageElement).src !== originalImage) {
            (event.target as HTMLImageElement).src = originalImage;
        } else {
            (event.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/6427881?v=4';
        }
    }

    const isNotURL = (str: string) => {
        const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        return !urlRegex.test(str);
    }

    return (
        <li key={url} className="block flex mx-auto p-4 w-full bg-white border hover:shadow-lg box-border shadow-inner item-center overflow-x-hidden">
            <img
                src={image}
                alt={''}
                onError={handleImageError}
                className="w-12 h-12 object-cover rounded-full mr-2"
            />
            <div className="w-full">
                <p className="text-sm font-medium text-gray-900 break-word ">{isNotURL(title) ? title : originalTitle}</p>
                <p className="break-all">
                    <a href={url} className="block max-w-full text-blue-600 overflow-hidden whitespace-nowrap truncate" target="_blank">{url}</a>
                </p>
                <p className="text-sm flex justify-between">
                    <span className="text-gray-500">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                    <span className="text-gray-300">{author || ''}</span>
                    <span className="text-green-500">{type || ''}</span>
                </p>
            </div>
        </li>
    );
};

export default BookmarksListItem;