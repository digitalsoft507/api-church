/**
 * User.ts
 * Description: Controller to list, view, add, update and delete users.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { validationMiddleware, authMiddleware } from '../../middleware';
import { Controller, RequestWithUser, User as UserInterface } from 'interfaces';
import { Profiles as ProfilModel, User as UserModel } from '../../modelsSequelize';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto, ChangePasswordDto } from '../../dto/users';
import { Info, GetWhere } from '../../helpers';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions';

export class UserController implements Controller {
    public path = '/user';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/view-perfil`, authMiddleware, this.viewPerfil);
        this.router.post(`${this.path}/list`, authMiddleware, validationMiddleware(FindDto), this.list);
        this.router.post(`${this.path}/view`, authMiddleware, validationMiddleware(FindByIdDto), this.view);
        this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateDto), this.create);
        this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateDto), this.update);
        this.router.put(`${this.path}/change-password`, authMiddleware, validationMiddleware(ChangePasswordDto), this.changePassword);
        this.router.post(`${this.path}/delete`, authMiddleware, validationMiddleware(DeleteDto), this.delete);
        this.router.post(`${this.path}/checkin-login`, authMiddleware, this.checkinLogin);
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };

            const users: UserInterface[] = await UserModel.findAll({
                where, order: [['_id', 'DESC']]
            });
            if (users && users.length <= 0) {
                return next(new Response404(Info.USERS_NOT_FOUND));
            }

            let UsersFormmatted = [];
            await Promise.all(users && users.map(async (user) => {
                if (user.email !== 'system@digitalsoft.com') {
                    const profileX = await ProfilModel.findOne({ where: { _id: user.profile } })
                    let userFormatted = {
                        ...user['dataValues'],
                        password: undefined,
                        profile: profileX
                    };
                    UsersFormmatted.push(userFormatted);
                }
            }));

            if (UsersFormmatted.length > 0) {
                return response.send(new Response200(Info.USER_LIST, UsersFormmatted));
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

            const findData = await UserModel.findOne({ where: { _id, email } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            findData.lastName = body.lastName;
            findData.firstName = body.firstName;
            findData.profile = Number(body.profile);
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                const profileX = await ProfilModel.findOne({ where: { _id: item.profile } });
                const data = {
                    ...item,
                    password: undefined,
                    profile: profileX
                };
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
            const _id = body._id;
            const email = body.email;

            if (body.password !== body.passwordConfirmation) {
                return next(new Response404(Info.USER_PASSWORD_NOT_MATCH));
            }

            const findData = await UserModel.findOne({ where: { _id, email } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            const hashedPassword = await bcrypt.hash(body.password, 10);
            findData.password = hashedPassword;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                const profilex = await ProfilModel.findOne({ where: { _id: item.profile } })
                const data = { ...item, password: undefined, profile: profilex };
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
            if (await UserModel.findOne({ where: { email: body.email } })) {
                return next(new AlreadyExistsException(`${Info.USER_EMAIL_ALREADY} - ${body.email}`));
            } else {
                const hashedPassword = await bcrypt.hash(body.password, 10);

                const saved = new UserModel({
                    ...body,
                    status: 'ACTIVE',
                    password: hashedPassword,
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });

                const result = await saved.save();
                if (result && result['dataValues']) {
                    const item = result['dataValues'];
                    const profileX = await ProfilModel.findOne({ where: { _id: item.profile } });
                    const data = {
                        ...item,
                        password: undefined,
                        profile: profileX
                    };
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
            const findData = await UserModel.findOne({ where: { _id, email } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                const profileX = await ProfilModel.findOne({ where: { _id: item.profile } });
                const data = {
                    ...item,
                    password: undefined,
                    profile: profileX
                };

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
            let findData = await UserModel.findOne({ where: { _id } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            const profile = await ProfilModel.findOne({ where: { _id: findData.profile } });
            findData.password = undefined;

            return response.send(new Response200(Info.USER_FOUND, { ...findData['dataValues'], profile }));
        } catch (ex) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private viewPerfil = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const _id = Number(request.user._id);
            let findData = await UserModel.findOne({ where: { _id } });
            if (!findData) {
                return next(new Response404(Info.USER_NOT_FOUND));
            }

            const profile = await ProfilModel.findOne({ where: { _id: findData.profile } });
            findData.password = undefined;

            return response.send(new Response200(Info.USER_FOUND, { ...findData['dataValues'], profile }));
        } catch (ex) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private checkinLogin = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            return response.send(new Response200(Info.USER_FOUND, { user: request.user }));
        } catch (ex) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}