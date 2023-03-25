/**
 * Church.ts
 * Description: Controller to list, view, add, update and delete churchs.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { RequestWithUser, Churche as ChurcheInterface, Country as CountryInterface, Province as ProvinceInterface } from '../../interfaces';
import { Churche as ChurcheModel, Country as CountryModel, Province as ProvinceModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/churche';
import { Info, GetWhere } from '../../helpers';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions';

export class ChurcheController {
    public path = '/churchs';
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
            if (await ChurcheModel.findOne({ where: { name: body.name } })) {
                return next(new AlreadyExistsException(`${Info.CHURCHE_ALREADY} - ${body.name}`));
            } else {
                const saved = new ChurcheModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.CHURCHE_REGISTRED, result));
                } else {
                    return next(new Response404(Info.CHURCHE_NOT_REGISTRED));
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

            const findData = await ChurcheModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.CHURCHE_NOT_FOUND));
            }

            findData.name = body.name;
            findData.countryId = body.countryId;
            findData.provinceId = body.provinceId;
            findData.description = body.description;;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.CHURCHE_UPDATED, item));
            } else {
                return next(new Response404(Info.CHURCHE_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };
            const attributes = ['_id', 'name', 'description'];

            //search country
            const findDataCountry: CountryInterface = await CountryModel.findOne({
                where: { _id: body.countryId }, attributes
            });
            if (!findDataCountry) {
                return next(new Response404(Info.COUNTRY_NOT_FOUND));
            }

            //search province
            const findDataProvince: ProvinceInterface = await ProvinceModel.findOne({
                where: { _id: body.provinceId }, attributes
            });
            if (!findDataProvince) {
                return next(new Response404(Info.PROVINCE_NOT_FOUND));
            }

            const findData: ChurcheInterface[] = await ChurcheModel.findAll({
                where,
                order: [['_id', 'DESC']],
                attributes: ['_id', 'countryId', 'provinceId', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CHURCHES_NOT_FOUND));
            }

            return response.send(new Response200(Info.CHURCHES_LIST, {
                country: findDataCountry['dataValues'],
                province: findDataProvince['dataValues'],
                churchs: findData
            }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const name = body.name;
            const findData = await ChurcheModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.CHURCHE_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];

                return response.send(new Response200(Info.CHURCHE_DELETED, item));
            } else {
                return next(new Response404(Info.CHURCHE_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listDropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const findData: ChurcheInterface[] = await ChurcheModel.findAll();
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CHURCHES_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: item.name });
            }));

            return response.send(new Response200(Info.CHURCHE_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: ChurcheInterface = await ChurcheModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.CHURCHE_NOT_FOUND));
            }

            return response.send(new Response200(Info.CHURCHE_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}