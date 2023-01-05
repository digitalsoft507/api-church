import { NextFunction, Response } from 'express';
const moment = require('moment-timezone');
import { Response401, Response403, Response501 } from '../exceptions/index';
import { RequestWithUser } from '../interfaces/index';
import { User as userModel, Profiles as ProfileModel, Roles as RolModel } from '../modelsSequelize';
import 'dotenv/config';
import { Op } from 'sequelize';
import { Session } from '../helpers/lSession';
import { formatDate } from '../helpers/formatDate';
import { Info } from '../helpers/global';

export async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const headers = request.headers;
    const headers2 = { ...request.headers, originalUrl: request.originalUrl, path: request.route.path };
    const session = await Session.FilterSessionByToken(headers.authorization, 'admin');
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
            let user = await userModel.findOne({ where: { _id: Number(id) }, raw: true });
            if (user) {
                const profile = await ProfileModel.findOne({ where: { _id: user.profile }, raw: true });
                if (!profile) {
                    return next(new Response403(Info.LOGIN_NOT_PROFILE));
                }

                const roles = await RolModel.findAll({ where: { code: { [Op.in]: profile.roles } }, raw: true });
                if (roles && roles.length <= 0) {
                    return next(new Response403(Info.LOGIN_NOT_ROLES));
                }

                const profileRaw = {
                    ...profile,
                    roles: roles
                }
                const userFormatted = {
                    ...user,
                    _id: id,
                    profile: profileRaw,
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


