/**
 * Coadjutor.ts
 * Description: Controller to list, view, add, update and delete coadjutors.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { Controller, RequestWithUser, Coadjutor as CoadjutorInterface } from 'interfaces/index';
import { Coadjutor as CoadjutorModel } from '../../modelsSequelize';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto, ChangePasswordDto } from '../../dto/coadjutor';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';

class CoadjutorController implements Controller {
    public path = '/coadjutors';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateDto), this.create);
        this.router.get(`${this.path}/list`, authMiddleware, validationMiddleware(FindDto), this.list);
        this.router.get(`${this.path}/view`, authMiddleware, validationMiddleware(FindByIdDto), this.view);
        this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateDto), this.update);
        this.router.put(`${this.path}/changed-password`, authMiddleware, validationMiddleware(ChangePasswordDto), this.changePassword);
        this.router.delete(`${this.path}/delete`, authMiddleware, validationMiddleware(DeleteDto), this.delete);
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: CoadjutorInterface[] = await CoadjutorModel.findAll({
                where, order: [['_id', 'DESC']]
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.USERS_NOT_FOUND));
            }

            let format = [];
            await Promise.all(findData && findData.map(async (item) => {
                let formatted = { ...item['dataValues'], password: undefined };
                format.push(formatted);
            }));

            if (format.length > 0) {
                return response.send(new Response200(Info.USER_LIST, format));
            } else {
                return next(new Response404(Info.USERS_NOT_FOUND));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private update = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: UpdateDto = request.body;
            const _id = body._id;
            const email = body.email;

            const findData = await CoadjutorModel.findOne({ where: { _id, email } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            findData.lastName = body.lastName;
            findData.firstName = body.firstName;
            findData.cellPhone = body.cellPhone;
            findData.updatedAt = request.user.currentTime

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                const data = { ...item, password: undefined, };
                return response.send(new Response200(Info.USER_UPDATED, data));
            } else {
                return next(new Response404(Info.USER_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private changePassword = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: ChangePasswordDto = request.body;

            if (body.password !== body.passwordConfirmation) {
                return next(new Response404(Info.USER_PASSWORD_NOT_MATCH));
            }

            const _id = body._id;
            const email = body.email;

            const findData = await CoadjutorModel.findOne({ where: { _id, email } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            const hashedPassword = await bcrypt.hash(body.password, 10);
            findData.password = hashedPassword;
            findData.updatedAt = request.user.currentTime

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                const data = { ...item, password: undefined };
                return response.send(new Response200(Info.USER__PASSWORD_UPDATED, data));
            } else {
                return next(new Response404(Info.USER_PASSWORD_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private create = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: CreateDto = request.body;
            if (await CoadjutorModel.findOne({ where: { email: body.email } })) {
                return next(new AlreadyExistsException(`${Info.USER_EMAIL_ALREADY} - ${body.email}`));
            } else {
                const hashedPassword = await bcrypt.hash(body.password, 10);

                const saved = new CoadjutorModel({
                    ...body,
                    password: hashedPassword,
                    status: 'INACTIVE'
                });

                const result = await saved.save();
                if (result && result['dataValues']) {
                    const item = result['dataValues'];
                    const data = { ...item, password: undefined };
                    return response.send(new Response200(Info.USER_REGISTRED, data));
                } else {
                    return next(new Response404(Info.USER_NOT_REGISTRED));
                }
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const email = body.email;
            const findData = await CoadjutorModel.findOne({ where: { _id, email } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                const data = { ...item, password: undefined };

                return response.send(new Response200(Info.USER_DELETED, data));
            } else {
                return next(new Response404(Info.USER_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const _id = body._id;
            let findData = await CoadjutorModel.findOne({ where: { _id } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            findData.password = undefined;

            return response.send(new Response200(Info.USER_FOUND, { ...findData['dataValues'] }));
        } catch (ex) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default CoadjutorController;