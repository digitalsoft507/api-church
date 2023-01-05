export interface User {
    _id: Number,
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profile?: any;
    currentUser?: any;
    currentTime?: Date;
}