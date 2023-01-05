/**
 * Chapter.ts
 * Description: Controller to list, view, add, update and delete chapters.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { RequestWithUser, Chapter as ChapterInterface, Will as WillInterface, Book as BookInterface } from '../../interfaces/index';
import { Chapter as ChapterModel, Will as WillModel, Book as BookModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/chapter';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';

class ChapterController {
    public path = '/chapters';
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
            const chapter = body.chapter;
            const willId = body.willId;
            const bookId = body.bookId;
            if (await ChapterModel.findOne({ where: { chapter, willId, bookId } })) {
                return next(new AlreadyExistsException(`${Info.CHAPTER_ALREADY} - chapter: ${chapter}, will: ${willId}, book: ${bookId}`));
            } else {
                const saved = new ChapterModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.CHAPTER_REGISTRED, result));
                } else {
                    return next(new Response404(Info.CHAPTER_NOT_REGISTRED));
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
            const chapter = body.chapter;

            const findData = await ChapterModel.findOne({ where: { _id, chapter } });
            if (!findData) {
                return next(new Response404(Info.CHAPTER_NOT_FOUND));
            }

            findData.chapter = body.chapter;
            findData.description = body.description;;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.CHAPTER_UPDATED, item));
            } else {
                return next(new Response404(Info.CHAPTER_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            const where = { ...GetWhere(body) };

            //search will
            const findDataWill: WillInterface = await WillModel.findOne({
                where: { _id: body.willId }, attributes: ['_id', 'name', 'description']
            });

            if (!findDataWill) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }

            //search book
            const findDataBook: BookInterface = await BookModel.findOne({
                where: { _id: body.bookId }, attributes: ['_id', 'name', 'description', 'willId']
            });

            if (!findDataBook) {
                return next(new Response404(Info.BOOK_NOT_FOUND));
            }

            const findData: ChapterInterface[] = await ChapterModel.findAll({
                where, order: [['chapter', 'ASC']]
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CHAPTERS_NOT_FOUND));
            }

            return response.send(new Response200(Info.CHAPTERS_LIST, {
                will: findDataWill['dataValues'],
                book: findDataBook['dataValues'],
                chapters: findData
            }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const chapter = body.chapter;
            const findData = await ChapterModel.findOne({ where: { _id, chapter } });
            if (!findData) {
                return next(new Response404(Info.CHAPTER_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];

                return response.send(new Response200(Info.CHAPTER_DELETED, item));
            } else {
                return next(new Response404(Info.CHAPTER_NOT_DELETED));
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

            if (!body.bookId) {
                return next(new Response404(Info.BOOK_CHOICE));
            }

            const where = { ...GetWhere(body) };
            const findData: ChapterInterface[] = await ChapterModel.findAll({
                where, order: [["chapter", "asc"]]
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CHAPTERS_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({
                    _id: item._id,
                    value: item._id,
                    label: `Chapter ${item.chapter}`
                });
            }));

            return response.send(new Response200(Info.CHAPTER_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: ChapterInterface = await ChapterModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.CHAPTER_NOT_FOUND));
            }

            return response.send(new Response200(Info.CHAPTER_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default ChapterController;