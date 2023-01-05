/**
 * Book.ts
 * Description: Controller to list, view, add, update and delete books.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { Controller, RequestWithUser, Book as BookInterface, Will as WillInterface } from '../../interfaces/index';
import { Book as BookModel, Will as WillModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/book';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';

class BookController implements Controller {
    public path = '/books';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(`${this.path}/list`, authMiddleware, validationMiddleware(FindDto), this.list);
        this.router.post(`${this.path}/dropdown`, authMiddleware, validationMiddleware(FindDto), this.dropDown);
        this.router.post(`${this.path}/view`, authMiddleware, validationMiddleware(FindByIdDto), this.view);
        this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateDto), this.create);
        this.router.put(`${this.path}/update`, authMiddleware, validationMiddleware(UpdateDto), this.update);
        this.router.put(`${this.path}/delete`, authMiddleware, validationMiddleware(DeleteDto), this.delete);
    }

    private create = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: CreateDto = request.body;
            if (await BookModel.findOne({ where: { name: body.name } })) {
                return next(new AlreadyExistsException(`${Info.BOOK_ALREADY} - ${body.name}`));
            } else {
                const saved = new BookModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.BOOK_REGISTRED, result));
                } else {
                    return next(new Response404(Info.BOOK_NOT_REGISTRED));
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

            const findData = await BookModel.findOne({ where: { _id/* , name */ } });
            if (!findData) {
                return next(new Response404(Info.BOOK_NOT_FOUND));
            }

            findData.name = body.name;
            findData.description = body.description;;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.BOOK_UPDATED, item));
            } else {
                return next(new Response404(Info.BOOK_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            if (!body.willId) {
                return next(new Response404(Info.WILL_CHOICE));
            }

            /* const findDataWills: WillInterface[] = await WillModel.findAll({
                attributes: ['_id', 'name', 'description']
            });
            if (findDataWills && findDataWills.length <= 0) {
                return next(new Response404(Info.WILLS_NOT_FOUND));
            }
            let dropdownWills = [];
            await Promise.all(findDataWills && findDataWills.map((item) => {
                dropdownWills.push({ _id: item._id, value: item._id, label: item.name });
            })); */


            const where = { ...GetWhere(body) };
            //search will
            const findDataWill: WillInterface = await WillModel.findOne({
                where: { _id: body.willId }, attributes: ['_id', 'name', 'description']
            });

            if (!findDataWill) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }

            const findData: BookInterface[] = await BookModel.findAll({
                where,
                /* include: [{
                    model: WillModel,
                    as: 'Wills' 
                }], */
                order: [['_id', 'ASC']]
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.BOOKS_NOT_FOUND));
            }

            return response.send(new Response200(Info.BOOKS_LIST, { will: findDataWill['dataValues'], /* wills: dropdownWills, */ books: findData }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const name = body.name;
            const findData = await BookModel.findOne({ where: { _id, name } });
            if (!findData) {
                return next(new Response404(Info.BOOK_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.BOOK_DELETED, item));
            } else {
                return next(new Response404(Info.BOOK_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private dropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            if (!body.willId) {
                return next(new Response404(Info.WILL_CHOICE));
            }

            const where = { ...GetWhere(body) };
            const findData: BookInterface[] = await BookModel.findAll({ where, order: [["_id", "asc"]] });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.BOOKS_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: item.name });
            }));

            return response.send(new Response200(Info.BOOK_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: BookInterface = await BookModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.BOOK_NOT_FOUND));
            }

            return response.send(new Response200(Info.BOOK_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default BookController;