import { FolderMap } from "../types";
import ListItem from "./BookmarksListItem";

const BookmarksList = ({ foldersMap }: { foldersMap: FolderMap | undefined }) => {

    return (
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
            {
                foldersMap ? (
                    <>
                        {
                            Array.from(foldersMap.entries()).map(([folder, bookmarks]) => (
                                <>
                                    <div className="divide-y divide-gray-200 flex justify-center items-center bg-gray-200 border border-white">
                                        <div className="text-gray-900 py-2">{folder || 'Default'}</div>
                                    </div>
                                    <>
                                        {bookmarks.map((bookmark, index) => (
                                            <ListItem key={index + bookmark.id} bookmark={bookmark} />
                                        ))}
                                    </>
                                </>
                            ))
                        }
                    </>
                ) : (
                    <></>
                )
            }
        </div>
    );
};

export default BookmarksList