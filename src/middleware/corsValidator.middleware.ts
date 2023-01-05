

import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../interfaces/index';
import 'dotenv/config';
//import { User } from '../interfaces/index';
//import { Response400 } from '../exceptions';
//import { Info } from '../helpers/global';

async function corsValidator(request: RequestWithUser, response: Response, next: NextFunction) {
    next();
    //const user: User = request.user;
    /* if ((user || []).includes(request.hostname)) {
        next()
    } else {
        return next(new Response400(Info.ORIGIN_NOT_IMPLEMENTED));
    } */
}

export default corsValidator;


