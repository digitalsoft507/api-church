export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface DataStoredInToken {
    _id: Number;
}

export interface DataStoredInTokenAnonymous {
    email: string;
    firstName: string; 
    lastName: string;
}

