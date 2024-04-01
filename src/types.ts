interface Bookmark {
    id: number;
    parentId: number,
    title: string,
    dateAdded: number,
    dateGroupModified: number,
    url: string,
    folder: string,
    image?: string,
    author?: string,
    originalImage?: string,
    originalTitle?: string,
    type?: string,
    keywords?: string,
    description?: string,
    status: boolean
}

type FolderMap = Map<string, Bookmark[]>;

export type {
    Bookmark,
    FolderMap
}

