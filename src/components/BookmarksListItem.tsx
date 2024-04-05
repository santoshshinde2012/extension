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

    const isNotURL = (str: string) => {
        const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        return !urlRegex.test(str);
    }

    return (
        <li key={url + dateAdded} className="flex w-full p-4 bg-white border hover:shadow-lg box-border shadow-inner items-center">
            <div className="w-12 h-12 flex-shrink-0">
                <img
                    src={originalImage ?? image}
                    alt={''}
                    className="w-full h-full object-cover rounded-full"
                />
            </div>
            <div className="ml-2">
                <p className="text-sm font-medium text-gray-900 break-word ">{isNotURL(title) ? title : originalTitle}</p>
                <p className="break-all">
                    <a href={url} className="text-blue-600" target="_blank">{url}</a>
                </p>
                <div className="text-sm flex items-center justify-between">
                    <div className="text-gray-500">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    {
                        author && (
                            <div className="text-gray-300">{author}</div>
                        )
                    }
                    {
                        type && (
                            <div className="text-green-300">{type}</div>
                        )
                    }
                </div>
            </div>
        </li>
    );
};

export default BookmarksListItem;