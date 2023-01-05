/**
 * Preacher.ts
 * Description: Controller to list, view, add, update and delete preachers.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { RequestWithUser, Preacher as PreacherInterface, Charge as ChargeInterface } from '../../interfaces/index';
import { Preacher as PreacherModel, Charge as ChargeModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/preacher';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';

class PreacherController {
    public path = '/preachers';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(`${this.path}/list`, authMiddleware, validationMiddleware(FindDto), this.list);
        this.router.get(`${this.path}/dropdown`, authMiddleware, this.listDropDown);
        this.router.get(`${this.path}/view`, authMiddleware, validationMiddleware(FindByIdDto), this.view);
        this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateDto), this.create);
        this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateDto), this.update);
        this.router.delete(`${this.path}/delete`, authMiddleware, validationMiddleware(DeleteDto), this.delete);
    }

    private create = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: CreateDto = request.body;
            const firstName = body.firstName;
            const lastName = body.lastName;
            if (await PreacherModel.findOne({ where: { firstName, lastName } })) {
                return next(new AlreadyExistsException(`${Info.PREACHER_ALREADY} - ${firstName} ${lastName}`));
            } else {
                const saved = new PreacherModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.PREACHER_REGISTRED, result));
                } else {
                    return next(new Response404(Info.PREACHER_NOT_REGISTRED));
                }
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private update = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: UpdateDto = request.body;
            const _id = body._id;

            const findData = await PreacherModel.findOne({ where: { _id } });
            if (!findData) {
                return next(new Response404(Info.PREACHER_NOT_FOUND));
            }

            findData.firstName = body.firstName;
            findData.lastName = body.lastName;
            findData.email = body.email;
            findData.phone = body.phone;
            findData.chargeId = body.chargeId;
            findData.description = body.description;;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.PREACHER_UPDATED, item));
            } else {
                return next(new Response404(Info.PREACHER_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };

            //search charge
            const findDataCharge: ChargeInterface = await ChargeModel.findOne({
                where: { _id: body.chargeId },
                attributes: ['_id', 'name', 'description']
            });

            if (!findDataCharge) {
                return next(new Response404(Info.CHARGE_NOT_FOUND));
            }

            const findData: PreacherInterface[] = await PreacherModel.findAll({
                where, order: [['_id', 'DESC']],
                attributes: ['_id', 'chargeId', 'firstName', 'lastName', 'email', 'phone', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.PREACHER_NOT_FOUND));
            }

            return response.send(new Response200(Info.PREACHERS_LIST, {
                charge: findDataCharge['dataValues'],
                preachers: findData
            }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const firstName = body.firstName;
            const lastName = body.lastName;

            const findData = await PreacherModel.findOne({ where: { _id, firstName, lastName } });
            if (!findData) {
                return next(new Response404(Info.PREACHER_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];

                return response.send(new Response200(Info.PREACHER_DELETED, item));
            } else {
                return next(new Response404(Info.PREACHER_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listDropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const findData: PreacherInterface[] = await PreacherModel.findAll();
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.PREACHERS_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: `${item.firstName} ${item.lastName}` });
            }));

            return response.send(new Response200(Info.PREACHER_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: PreacherInterface = await PreacherModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.PREACHER_NOT_FOUND));
            }

            return response.send(new Response200(Info.PREACHER_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default PreacherController;