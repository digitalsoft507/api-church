import { NextFunction, Response } from 'express';
const moment = require('moment-timezone');
import { Response401, Response403, Response501 } from '../exceptions/index';
import { RequestWithUser } from '../interfaces/index';
import { Coadjutor as CoadjutorModel } from '../modelsSequelize';
import 'dotenv/config';
import { Session } from '../helpers/lSession';
import { formatDate } from '../helpers/formatDate';
import { Info } from '../helpers/global';

export async function appAuthMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const headers = request.headers;
    const session = await Session.FilterSessionByToken(headers.authorization, 'app');
    try {
        if (session !== null) {
            const currentTime = formatDate._currentDateTime();
            const FechaHoraStart = formatDate._currentDateTimeLess5(session.FechaHoraStart);
            const FechaHoraEnd = formatDate._currentDateTimeLess5(session.FechaHoraEnd);
            const r = moment(currentTime).isBetween(FechaHoraStart, FechaHoraEnd);
            if (!r) {
                return next(new Response403(Info.TOKEN_INVALID));
            }

            const id = session.IdUser;
            let user = await CoadjutorModel.findOne({ where: { _id: Number(id) }, raw: true });
            if (user) {
                const userFormatted = {
                    ...user,
                    _id: id,
                    password: undefined,
                    currentUser: { _id: id, email: user.email },
                    currentTime: currentTime
                }
                request.user = userFormatted;
                return next();
            } else {
                return next(new Response403(Info.USER_NOT_FOUND));
            }
        } else {
            return next(new Response401(`AuthMiddleware - ${Info.UNAUTHORIZED}`));
        }
    } catch (error) {
        return next(new Response501(`AuthMiddleware - ${Info.SERVER_ERROR_INERNAL}`));
    }
}