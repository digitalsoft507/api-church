/**
 * Login.ts
 * Description: Controller to login app-login.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Controller } from '../../interfaces/index';
import { Coadjutor as CoadjutorModel } from '../../modelsSequelize';
import LogInDto from '../../dto/authentication/logIn.dto';
import { Session } from '../../helpers/lSession';
import { Info } from '../../helpers/global';
import { createTokenCoadjutor, validationMiddleware } from '../../middleware/index';
import { Response200, Response404, Response501 } from '../../exceptions'

export class AppLoginController implements Controller {
    public path = '/app/auth';
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

            let user = await CoadjutorModel.findOne({ where: { email: logInData.email }, raw: true });
            if (!user) {
                return next(new Response404(Info.LOGIN_BAD_CREDENCIAL));
            }

            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (!isPasswordMatching) {
                return next(new Response404(Info.LOGIN_INVALID_PASSWORD));
            }

            const formatted = {
                _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email
            };

            const tokenData = createTokenCoadjutor(user);
            await Session.CreateSession(tokenData.token, logInData.email, user._id, 'app');
            return response.send(new Response200(Info.LOGIN_SUCCESS, { user: formatted, token: tokenData.token }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - Login ${ex.message}`));
        }
    }
}