/**
 * Profile.ts
 * Description: Controller to list, view, add, update and delete profiles.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, FindDto, FindByIdDto, RolFindDto, DeleteDto } from '../../dto/profiles';
import { Profiles as ProfilModel, Roles as RolModel } from '../../modelsSequelize';
import { Controller, RequestWithUser, Profile as ProfileInterface, Rol as RolInterface } from '../../interfaces/index';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';
import { Op } from 'sequelize';

class ProfileController implements Controller {
    public path = '/profile';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/list-roles`, authMiddleware, validationMiddleware(RolFindDto), this.listRoles);
        this.router.get(`${this.path}/list`, authMiddleware, validationMiddleware(FindDto), this.list);
        this.router.get(`${this.path}/view`, authMiddleware, validationMiddleware(FindByIdDto), this.viewProfile);
        this.router.get(`${this.path}/dropdown`, authMiddleware, this.dropDownProfile);
        this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateDto), this.createProfile);
        this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateDto), this.updateProfile);
        this.router.delete(`${this.path}/delete`, authMiddleware, validationMiddleware(DeleteDto), this.deleteProfile);
    }

    private listRoles = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: RolFindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: RolInterface[] = await RolModel.findAll({ where });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.ROLES_NOT_FOUND));
            }

            return response.send(new Response200(Info.ROLES_LIST, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };
            /* const name = body.name;
            let where = {};
            if (name) {
                where = { [Op.or]: [{ name: { [Op.like]: `%${name}%` } }] };
            } */

            const findData: ProfileInterface[] = await ProfilModel.findAll({
                where, order: [['_id', 'DESC']],
            });

            if (findData && findData.length <= 0) {
                return next(new Response404(Info.PROFILES_NOT_FOUND));
            }

            let formmatted = [];
            await Promise.all(findData && findData.map(async (profile) => {
                //if (profile._id !== 1) {
                formmatted.push(profile['dataValues']);
                //}
            }));

            if (formmatted.length > 0) {
                return response.send(new Response200(Info.PROFILE_LIST, formmatted));
            } else {
                return next(new Response404(Info.PROFILES_NOT_FOUND));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private dropDownProfile = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const profiles: ProfileInterface[] = await ProfilModel.findAll();
            if (profiles && profiles.length <= 0) {
                return next(new Response404(Info.PROFILES_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(profiles && profiles.map(async (item) => {
                dropdown.push({ value: item._id, label: item.name });
            }));

            return response.send(new Response200(Info.PROFILE_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private createProfile = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: CreateDto = request.body;
            if (await ProfilModel.findOne({ where: { name: body.name } })) {
                return next(new AlreadyExistsException(`${Info.PROFILE_NAME_ALREADY} - ${body.name}`));
            } else {
                const saved = new ProfilModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.PROFILE_REGISTRED, result));
                } else {
                    return next(new Response404(Info.PROFILE_NOT_REGISTRED));
                }
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private updateProfile = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: UpdateDto = request.body;
            const _id = body._id;

            /* if (_id === 1) {
                return next(new Response404(Info.PROFILE_NOT_ALLOW_UPDATED));
            } */

            const name = body.name;
            const findData = await ProfilModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.PROFILE_NOT_FOUND));
            }

            findData.roles = body.roles;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.PROFILE_UPDATED, item));
            } else {
                return next(new Response404(Info.PROFILE_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private deleteProfile = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;

            if (_id === 1) {
                return next(new Response404(Info.PROFILE_NOT_ALLOW_DELETED));
            }

            const name = body.name;
            const findData = await ProfilModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.PROFILE_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.PROFILE_DELETED, item));
            } else {
                return next(new Response404(Info.PROFILE_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private viewProfile = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const _id = Number(body._id);
            let findData = await ProfilModel.findOne({ where: { _id } });
            if (!findData) {
                return next(new Response404(Info.PROFILE_NOT_FOUND));
            }

            return response.send(new Response200(Info.PROFILE_FOUND, { ...findData['dataValues'] }));
        } catch (ex) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default ProfileController;