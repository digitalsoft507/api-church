/**
 * Will.ts
 * Description: Controller to list, view, add, update and delete wills.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { Controller, RequestWithUser, Will as WillInterface } from '../../interfaces/index';
import { Will as WillModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/will';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';

class WillController implements Controller {
    public path = '/wills';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(`${this.path}/list`, authMiddleware, validationMiddleware(FindDto), this.list);
        this.router.post(`${this.path}/dropdown`, authMiddleware, this.dropDown);
        this.router.post(`${this.path}/view`, authMiddleware, validationMiddleware(FindByIdDto), this.view);
        this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateDto), this.create);
        this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateDto), this.update);
        this.router.put(`${this.path}/delete`, authMiddleware, validationMiddleware(DeleteDto), this.delete);
    }

    private create = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: CreateDto = request.body;
            if (await WillModel.findOne({ where: { name: body.name } })) {
                return next(new AlreadyExistsException(`${Info.WILL_ALREADY} - ${body.name}`));
            } else {
                const saved = new WillModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.WILL_REGISTRED, result));
                } else {
                    return next(new Response404(Info.WILL_NOT_REGISTRED));
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
            const name = body.name;

            const findData = await WillModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }

            findData.name = body.name;
            findData.description = body.description;;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.WILL_UPDATED, item));
            } else {
                return next(new Response404(Info.WILL_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: WillInterface[] = await WillModel.findAll({
                where, order: [['_id', 'DESC']]
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.WILLS_NOT_FOUND));
            }

            return response.send(new Response200(Info.WILLS_LIST, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const name = body.name;
            const findData = await WillModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.WILL_DELETED, item));
            } else {
                return next(new Response404(Info.WILL_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private dropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const findData: WillInterface[] = await WillModel.findAll();
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.WILLS_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: item.name });
            }));

            return response.send(new Response200(Info.WILL_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: WillInterface = await WillModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }

            return response.send(new Response200(Info.WILL_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default WillController;