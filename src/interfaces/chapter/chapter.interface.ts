export interface Chapter {
    _id?: number;
    chapter?: number;
    willId?: number;
    bookId?: number;
    description: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}