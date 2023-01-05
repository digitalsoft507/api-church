export interface Verse {
    _id?: number;
    verse?: number;
    chapterId?: number;
    willId?: number;
    bookId?: number;
    description: string;
    title: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}