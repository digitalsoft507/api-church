/**
 * Cult.ts
 * Description: Controller to list, view, add, update and delete cults.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { RequestWithUser, Cult as CultInterface, Country as CountryInterface, Province as ProvinceInterface, Churche as ChurcheInterface, Teaching as TeachingInterface } from '../../interfaces';
import { Cult as CultModel, Country as CountryModel, Province as ProvinceModel, Churche as ChurcheModel, Teaching as TeachingModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/cult';
import { Info, GetWhere } from '../../helpers';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions';

export class CultController {
    public path = '/cults';
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
            const countryId: Number = body.countryId;
            const provinceId: Number = body.provinceId;
            const churcheId: Number = body.churcheId;
            const teachingId: Number = body.teachingId;
            const day: string = body.day;
            const turn: string = body.turn;

            if (await CultModel.findOne({ where: { countryId, provinceId, churcheId, teachingId, day, turn } })) {
                return next(new AlreadyExistsException(`${Info.CULT_ALREADY} - country: ${countryId}, province: ${provinceId}, church: ${churcheId}, teaching: ${teachingId}, day: ${day}, turn: ${turn}`));
            } else {
                const saved = new CultModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.CULT_REGISTRED, result));
                } else {
                    return next(new Response404(Info.CULT_NOT_REGISTRED));
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
            const countryId: Number = body.countryId;
            const provinceId: Number = body.provinceId;
            const churcheId: Number = body.churcheId;

            const findData = await CultModel.findOne({ where: { _id, countryId, provinceId, churcheId } });
            if (!findData) {
                return next(new Response404(Info.CULT_NOT_FOUND));
            }

            findData.countryId = body.countryId;
            findData.provinceId = body.provinceId;
            findData.churcheId = body.countryId;
            findData.teachingId = body.teachingId;
            findData.day = body.day;
            findData.turn = body.turn;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.CULT_UPDATED, item));
            } else {
                return next(new Response404(Info.CULT_NOT_UPDATED));
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

            //search church
            const findDataChurche: ChurcheInterface = await ChurcheModel.findOne({
                where: { _id: body.churcheId }, attributes
            });
            if (!findDataChurche) {
                return next(new Response404(Info.CHURCHE_NOT_FOUND));
            }

            //search teaching
            let teaching: any = {};
            if (body.teachingId && body.teachingId != 0) {
                const findDataTeaching: TeachingInterface = await TeachingModel.findOne({
                    where: { _id: body.teachingId }, attributes
                });
                if (!findDataTeaching) {
                    return next(new Response404(Info.TEACHING_NOT_FOUND));
                }
                teaching = findDataTeaching;
            } else {
                teaching = { message: 'No info Data' };
            }

            const findData: CultInterface[] = await CultModel.findAll({
                where,
                order: [['_id', 'DESC']],
                attributes: ['_id', 'day', 'turn', 'countryId', 'provinceId', 'churcheId', 'teachingId']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CULTS_NOT_FOUND));
            }

            return response.send(new Response200(Info.CULTS_LIST, {
                country: findDataCountry['dataValues'],
                province: findDataProvince['dataValues'],
                church: findDataChurche['dataValues'],
                teaching: teaching,
                cults: findData
            }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const countryId: Number = body.countryId;
            const provinceId: Number = body.provinceId;
            const churcheId: Number = body.churcheId;
            const teachingId: Number = body.teachingId;

            const findData = await CultModel.findOne({ where: { _id, countryId, provinceId, churcheId, teachingId } });
            if (!findData) {
                return next(new Response404(Info.CULT_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];

                return response.send(new Response200(Info.CULT_DELETED, item));
            } else {
                return next(new Response404(Info.CULT_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listDropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const findData: CultInterface[] = await CultModel.findAll();
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CULTS_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: item._id });
            }));

            return response.send(new Response200(Info.CULT_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: CultInterface = await CultModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.CULT_NOT_FOUND));
            }

            return response.send(new Response200(Info.CULT_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}