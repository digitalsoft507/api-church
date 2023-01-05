
import { DataStoredInToken, TokenData, User as UserInterface, Coadjutor as CoadjutorInterface } from '../interfaces/index';
import * as jwt from 'jsonwebtoken';

export function createTokenCoadjutor(user: CoadjutorInterface): TokenData {
    return createToken(Number(user._id));
}

export function createTokenAdmin(user: UserInterface): TokenData {
    return createToken(Number(user._id));
}

function createToken(_id: number): TokenData {
    const expiresIn = 60 * 60 * 365; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = { _id };

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }), };
}