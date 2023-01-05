/**
 * Verse.ts
 * Description: Controller to list, view, add, update and delete verses.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import { RequestWithUser, Verse as VerseInterface, Chapter as ChapterInterface, Will as WillInterface, Book as BookInterface } from '../../interfaces/index';
import { Verse as VerseModel, Chapter as ChapterModel, Will as WillModel, Book as BookModel } from '../../modelsSequelize';
import { validationMiddleware, authMiddleware } from '../../middleware/index';
import { CreateDto, UpdateDto, DeleteDto, FindDto, FindByIdDto } from '../../dto/verse';
import { Info } from '../../helpers/global';
import { GetWhere } from '../../helpers/functionDb';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions/index';
import { biblieServices } from '../../services';

class VerseController {
    public path = '/verses';
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
            const verse: Number = body.verse;
            const chapterId: Number = body.chapterId;
            const willId: Number = body.willId;
            const bookId: Number = body.bookId;

            if (body.descriptionJson && Array.isArray(body.descriptionJson)) {
                body.descriptionJson.forEach(async (item: any) => {
                    if (await VerseModel.findOne({
                        where: {
                            verse: item.verse,
                            chapterId: item.chapterId,
                            willId: item.willId,
                            bookId: item.bookId
                        }
                    })) {
                        //console.log(`${Info.VERSE_ALREADY} - verse: ${item.verse}, chapter: ${item.chapterId}, will: ${item.willId}, book: ${item.bookId}`);
                    } else {
                        //console.log(`No Registrado - verse: ${item.verse}, chapter: ${item.chapterId}, will: ${item.willId}, book: ${item.bookId}`);
                        const saved = new VerseModel({
                            verse: item.verse,
                            chapterId: item.chapterId,
                            willId: item.willId,
                            bookId: item.bookId,
                            description: item.description,
                            status: 'ACTIVE',
                            createdBy: request.user.currentUser,
                            updatedBy: request.user.currentUser
                        });
                        const result = await saved.save();
                        if (result && result['dataValues']) {
                            console.log(`${Info.VERSE_REGISTRED} - verse: ${item.verse}, chapter: ${item.chapterId}, will: ${item.willId}, book: ${item.bookId}`);
                            //return response.send(new Response200(Info.VERSE_REGISTRED, result));
                        } else {
                            console.log(`${Info.VERSE_NOT_REGISTRED} - verse: ${item.verse}, chapter: ${item.chapterId}, will: ${item.willId}, book: ${item.bookId}`);
                            //return next(new Response404(Info.VERSE_NOT_REGISTRED));
                        }
                    }
                });
                return response.send(new Response200(Info.VERSE_REGISTRED, { message: 'OK' }));
            } else {
                if (await VerseModel.findOne({ where: { verse, chapterId, willId, bookId } })) {
                    return next(new AlreadyExistsException(`${Info.VERSE_ALREADY} - verse: ${verse}, chapter: ${chapterId}, will: ${willId}, book: ${bookId}`));
                } else {
                    const saved = new VerseModel({
                        ...body,
                        status: 'ACTIVE',
                        createdBy: request.user.currentUser,
                        updatedBy: request.user.currentUser
                    });
                    const result = await saved.save();
                    if (result && result['dataValues']) {
                        return response.send(new Response200(Info.VERSE_REGISTRED, result));
                    } else {
                        return next(new Response404(Info.VERSE_NOT_REGISTRED));
                    }
                }
            }


            /*
            PARA REGISTRAR LOS VERSOS 
            let verses = [];
            for (var i = 1; i <= verse; i++) { verses.push(i); }
            verses.forEach(async (el) => {
                const where = { verse: el, chapterId, willId, bookId };
                if ((!await VerseModel.findOne({ where: { ...where } }))) {
                    const saved = new VerseModel({
                        ...body,
                        verse: el,
                        status: 'ACTIVE',
                        createdBy: request.user.currentUser,
                        updatedBy: request.user.currentUser
                    });
                    const result = await saved.save();
                    if (result && result['dataValues']) {
                        console.log('Success', where)
                    } else {
                        console.log('Warning', where)
                    }
                }
            })
            return response.send(new Response200(Info.VERSE_REGISTRED, { message: 'OK' }));
            */

            /* if (await VerseModel.findOne({ where: { verse, chapterId, willId, bookId } })) {
                return next(new AlreadyExistsException(`${Info.VERSE_ALREADY} - verse: ${verse}, chapter: ${chapterId}, will: ${willId}, book: ${bookId}`));
            } else {
                const saved = new VerseModel({
                    ...body,
                    status: 'ACTIVE',
                    createdBy: request.user.currentUser,
                    updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.VERSE_REGISTRED, result));
                } else {
                    return next(new Response404(Info.VERSE_NOT_REGISTRED));
                }
            } */
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private update = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: UpdateDto = request.body;
            const _id = body._id;
            const verse = body.verse;

            const findData = await VerseModel.findOne({ where: { _id, verse } });
            if (!findData) {
                return next(new Response404(Info.VERSE_NOT_FOUND));
            }

            findData.verse = body.verse;
            findData.description = body.description;
            findData.title = body.title;
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];
                return response.send(new Response200(Info.VERSE_UPDATED, item));
            } else {
                return next(new Response404(Info.VERSE_NOT_UPDATED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private list = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindDto = request.body;
            let willId = body.willId;
            let bookId = body.bookId;
            let chapterId = body.chapterId;

            /** START FOR WILLS */
            //all wills
            const findWills: WillInterface[] = await WillModel.findAll({ order: [['_id', 'asc']] });
            if (findWills && findWills.length <= 0) {
                return next(new Response404(Info.WILLS_NOT_FOUND));
            }

            //for dropdown wills
            let dropdownWills = [];
            await Promise.all(findWills && findWills.map(async (item) => {
                dropdownWills.push({ _id: item._id, value: item._id, label: item.name });
            }));

            //search will
            let findDataWill: WillInterface;
            if (willId === 0) {
                const will = findWills[0];
                willId = will._id;
                findDataWill = await WillModel.findOne({ where: { _id: willId }, attributes: ['_id', 'name', 'description'] });
            } else {
                findDataWill = await WillModel.findOne({ where: { _id: willId }, attributes: ['_id', 'name', 'description'] });
            }

            if (!findDataWill) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }
            let dataWill = findDataWill['dataValues'];
            dataWill.value = dataWill._id;
            dataWill.label = dataWill.name;
            /** END WILLS */

            /** START FOR BOOKS */
            //all books
            const findBooks: BookInterface[] = await BookModel.findAll({
                where: { willId: willId },
                order: [['_id', 'asc']]
            });
            if (findBooks && findBooks.length <= 0) {
                return next(new Response404(Info.BOOKS_NOT_FOUND));
            }

            //for dropdown books
            let dropdownBooks = [];
            await Promise.all(findBooks && findBooks.map(async (item) => {
                dropdownBooks.push({ _id: item._id, value: item._id, label: item.name });
            }));

            //search book
            let findDataBook: BookInterface;
            if (bookId === 0) {
                const book = findBooks[0];
                bookId = book._id;
                findDataBook = await BookModel.findOne({ where: { _id: bookId }, attributes: ['_id', 'willId', 'name', 'description'] });
            } else {
                findDataBook = await BookModel.findOne({ where: { _id: bookId }, attributes: ['_id', 'willId', 'name', 'description'] });
            }

            if (!findDataBook) {
                return next(new Response404(Info.BOOK_NOT_FOUND));
            }
            let dataBook = findDataBook['dataValues'];
            dataBook.value = findDataBook._id;
            dataBook.label = findDataBook.name;
            /** END BOOKS */

            /** START FOR CHAPTERS */
            //all chapters
            const findChapters: ChapterInterface[] = await ChapterModel.findAll({
                where: { willId: willId, bookId: bookId },
                order: [['_id', 'asc']]
            });
            if (findChapters && findChapters.length <= 0) {
                return next(new Response404(Info.CHAPTERS_NOT_FOUND));
            }

            //for dropdown chapters
            let dropdownChapters = [];
            await Promise.all(findChapters && findChapters.map(async (item) => {
                dropdownChapters.push({ _id: item._id, value: item._id, label: `Chapter ${item.chapter}` });
            }));

            //search chapter
            let findDataChapter: ChapterInterface;
            if (chapterId === 0) {
                const chapter = findChapters[0];
                chapterId = chapter._id;
                findDataChapter = await ChapterModel.findOne({
                    where: { _id: chapterId }, attributes: ['_id', 'chapter', 'willId', 'bookId', 'description']
                });
            } else {
                findDataChapter = await ChapterModel.findOne({
                    where: { _id: chapterId }, attributes: ['_id', 'chapter', 'willId', 'bookId', 'description']
                });
            }

            if (!findDataChapter) {
                return next(new Response404(Info.CHAPTER_NOT_FOUND)); 
            }
            let dataChapter = findDataChapter['dataValues'];
            dataChapter.value = dataChapter._id;
            dataChapter.label = `Chapter ${dataChapter.chapter}`;
            /** END CHAPTERS */

            const where = { ...GetWhere({ ...body, willId, bookId, chapterId }) };
            const findData: VerseInterface[] = await VerseModel.findAll({
                where, order: [['verse', 'ASC']]
            });

            /* if (findData && findData.length <= 0) {
                return next(new Response404(Info.VERSES_NOT_FOUND));
            } */
            
            return response.send(new Response200(Info.VERSES_LIST, {
                will: dataWill,
                book: dataBook,
                chapter: dataChapter,
                wills: dropdownWills || [],
                books: dropdownBooks || [],
                chapters: dropdownChapters || [],
                verses: findData
            }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private delete = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: DeleteDto = request.body;
            const _id = body._id;
            const verse = body.verse;
            const findData = await VerseModel.findOne({ where: { _id, verse } });
            if (!findData) {
                return next(new Response404(Info.VERSE_NOT_FOUND));
            }

            findData.status = (findData.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
            findData.updatedBy = request.user.currentUser;
            findData.updatedAt = request.user.currentTime;

            const result = await findData.save();
            if (result && result['dataValues']) {
                const item = result['dataValues'];

                return response.send(new Response200(Info.VERSE_DELETED, item));
            } else {
                return next(new Response404(Info.VERSE_NOT_DELETED));
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private dropDown = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const findData: VerseInterface[] = await VerseModel.findAll();
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.VERSES_NOT_FOUND));
            }

            let dropdown = [];
            await Promise.all(findData && findData.map(async (item) => {
                dropdown.push({ _id: item._id, value: item._id, label: item.verse });
            }));

            return response.send(new Response200(Info.VERSE_LIST, dropdown));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private view = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: FindByIdDto = request.body;
            const findData: VerseInterface = await VerseModel.findOne({ where: { _id: body._id } });
            if (!findData) {
                return next(new Response404(Info.VERSE_NOT_FOUND));
            }

            return response.send(new Response200(Info.VERSE_FOUND, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }
}

export default VerseController;