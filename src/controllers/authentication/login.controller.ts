/**
 * Login.ts
 * Description: Controller to list, view, add, update and delete login.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Controller } from '../../interfaces/index';
import { User as UserModel, Profiles as ProfileModel, Roles as RolesModel } from '../../modelsSequelize';
import LogInDto from '../../dto/authentication/logIn.dto';
import { Op } from 'sequelize';
import { Session } from '../../helpers/lSession';
import { Info } from '../../helpers/global';
import { createTokenAdmin, validationMiddleware } from '../../middleware/index';
import { Response200, Response404, Response501 } from '../../exceptions'

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const logInData: LogInDto = request.body;

            let user = await UserModel.findOne({ where: { email: logInData.email }, raw: true });
            if (!user) {
                return next(new Response404(Info.LOGIN_BAD_CREDENCIAL));
            }

            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (!isPasswordMatching) {
                return next(new Response404(Info.LOGIN_INVALID_PASSWORD));
            }

            const profile = await ProfileModel.findOne({ where: { _id: user.profile }, raw: true });
            if (!profile) {
                return next(new Response404(Info.LOGIN_NOT_PROFILE));
            }

            const roles = await RolesModel.findAll({ where: { code: { [Op.in]: profile.roles } }, raw: true });
            if (roles && roles.length <= 0) {
                return next(new Response404(Info.LOGIN_NOT_ROLES));
            }

            let rolesFormmatted = []
            await Promise.all(roles.map(async (rol) => {
                rolesFormmatted.push({ name: rol.name, code: rol.code })
            }));

            const profileRaw = { _id: profile._id, name: profile.name, roles: rolesFormmatted };
            const userFormatted = {
                _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email,
                profile: profileRaw,
            };

            const tokenData = createTokenAdmin(user);
            await Session.CreateSession(tokenData.token, logInData.email, user._id, 'admin');
            return response.send(new Response200(Info.LOGIN_SUCCESS, { user: userFormatted, token: tokenData.token }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - Login ${ex.message}`));
        }
    }
}

export default AuthenticationController;