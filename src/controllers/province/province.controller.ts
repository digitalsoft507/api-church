/**
 * Province.ts
 * Description: Controller to list, view, add, update and delete provinces.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { RequestWithUser, Province as ProvinceInterface, Country as CountryInterface } from '../../interfaces/index';
import { Province as ProvinceModel, Country as CountryModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/province';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';

class ProvinceController {
    public path = '/provinces';
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
            if (await ProvinceModel.findOne({ where: { name: body.name, countryId: body.countryId } })) {
                return next(new AlreadyExistsException(`${Info.PROVINCE_ALREADY} - ${body.name} ${body.countryId}`));
            } else {
                const saved = new ProvinceModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.PROVINCE_REGISTRED, result));
                } else {
                    return next(new Response404(Info.PROVINCE_NOT_REGISTRED));
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

            const findData = await ProvinceModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.PROVINCE_NOT_FOUND));
            }

            findData.name = body.name;
            findData.countryId = body.countryId;
            findData.description = body.description;;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.PROVINCE_UPDATED, item));
            } else {
                return next(new Response404(Info.PROVINCE_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };

            //search country
            const findDataCountry: CountryInterface = await CountryModel.findOne({
                where: { _id: body.countryId },
                attributes: ['_id', 'name', 'description']
            });

            if (!findDataCountry) {
                return next(new Response404(Info.COUNTRY_NOT_FOUND));
            }

            //search province
            const findData: ProvinceInterface[] = await ProvinceModel.findAll({
                where, order: [['_id', 'DESC']],
                attributes: ['_id', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.PROVINCES_NOT_FOUND));
            }

            return response.send(new Response200(Info.PROVINCES_LIST, {
                country: findDataCountry['dataValues'],
                provinces: findData
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
            const findData = await ProvinceModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.PROVINCE_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];

                return response.send(new Response200(Info.PROVINCE_DELETED, item));
            } else {
                return next(new Response404(Info.PROVINCE_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listDropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const findData: ProvinceInterface[] = await ProvinceModel.findAll();
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.PROVINCES_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: item.name });
            }));

            return response.send(new Response200(Info.PROVINCE_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;

            const findData: ProvinceInterface = await ProvinceModel.findOne({
                where: { _id: body._id },
                attributes: ['_id', 'countryId', 'name', 'description']
            });
            if (!findData) {
                return next(new Response404(Info.PROVINCE_NOT_FOUND));
            }

            //search country
            const findDataCountry: CountryInterface = await CountryModel.findOne({
                where: { _id: findData.countryId },
                attributes: ['_id', 'name', 'description']
            });

            if (!findDataCountry) {
                return next(new Response404(Info.COUNTRY_NOT_FOUND));
            }

            return response.send(new Response200(Info.PROVINCE_FOUND, { country: findDataCountry['dataValues'], province: findData }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default ProvinceController;