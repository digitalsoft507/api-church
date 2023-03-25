/**
 * App All.ts
 * Description: Controller to list, view, add, update and delete app-all.
 * Ing. Samuel Vasquez
 * Email: digitalsoft507@gmail.com
 * Date Creation: 2022-dec-01 17:15
 */

import * as express from 'express';
import {
    RequestWithUser,
    Will as WillInterface,
    Book as BookInterface,
    Chapter as ChapterInterface,
    Verse as VerseInterface,
    Country as CountryInterface,
    Province as ProvinceInterface,
    Churche as ChurcheInterface,
    Charge as ChargeInterface,
    Preacher as PreacherInterface,
    Teaching as TeachingInterface,
    Verse as VerseReadInterface,
    Cult as CultInterface
} from '../../interfaces';
import {
    Will as WillModel,
    Book as BookModel,
    Chapter as ChapterModel,
    Verse as VerseModel,
    Country as CountryModel,
    Province as ProvinceModel,
    Churche as ChurcheModel,
    Charge as ChargeModel,
    Preacher as PreacherModel,
    Teaching as TeachingModel,
    VerseRead as VerseReadModel,
    Cult as CultModel,
} from '../../modelsSequelize';

import { validationMiddleware , appAuthMiddleware} from '../../middleware';

import { FindDto as WillFindDto } from '../../dto/will';
import { FindDto as BookFindDto } from '../../dto/book';
import { FindDto as ChapterFindDto } from '../../dto/chapter';
import { FindDto as VerseFindDto } from '../../dto/verse';
import { FindDto as CountryFindDto } from '../../dto/country';
import { FindDto as ProvinceFindDto } from '../../dto/province';
import { FindDto as ChurcheFindDto } from '../../dto/churche';
import { FindDto as ChargeFindDto } from '../../dto/charge';
import { FindDto as PreacherFindDto } from '../../dto/preacher';
import { FindDto as TeachingFindDto } from '../../dto/teaching';
import { CreateDto as VerseReadCreateDto } from '../../dto/verse-read';

import { Info, formatDate, GetWhere } from '../../helpers';
import { Response200, Response404, Response501, AlreadyExistsException } from '../../exceptions';

export class AppAllController {
    public path = '/app';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(`${this.path}/wills/list`, appAuthMiddleware, validationMiddleware(WillFindDto), this.listWills);
        this.router.post(`${this.path}/books/list`, appAuthMiddleware, validationMiddleware(BookFindDto), this.listBooks);
        this.router.post(`${this.path}/chapters/list`, appAuthMiddleware, validationMiddleware(ChapterFindDto), this.listChapters);
        this.router.post(`${this.path}/verses/list`, appAuthMiddleware, validationMiddleware(VerseFindDto), this.listVerses);
        this.router.post(`${this.path}/countrys/list`, appAuthMiddleware, validationMiddleware(CountryFindDto), this.listCountrys);
        this.router.post(`${this.path}/provinces/list`, appAuthMiddleware, validationMiddleware(ProvinceFindDto), this.listProvinces);
        this.router.post(`${this.path}/churchs/list`, appAuthMiddleware, validationMiddleware(ChurcheFindDto), this.listChurches);
        this.router.post(`${this.path}/charges/list`, appAuthMiddleware, validationMiddleware(ChargeFindDto), this.listCharges);
        this.router.post(`${this.path}/preachers/list`, appAuthMiddleware, validationMiddleware(PreacherFindDto), this.listPreachers);
        this.router.post(`${this.path}/teachings/list`, appAuthMiddleware, validationMiddleware(TeachingFindDto), this.listTeachings);

        this.router.post(`${this.path}/verse-read/register`, appAuthMiddleware, validationMiddleware(VerseReadCreateDto), this.RegisterVerseRead);

    }

    private listWills = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: WillFindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: WillInterface[] = await WillModel.findAll({
                where, order: [['_id', 'DESC']],
                attributes: ['_id', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.WILLS_NOT_FOUND));
            }
            
            return response.send(new Response200(Info.WILLS_LIST, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listBooks = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: BookFindDto = request.body;
            const where = { ...GetWhere(body) };

            //search will
            const findDataWill: WillInterface = await WillModel.findOne({
                where: { _id: body.willId }, attributes: ['_id', 'name', 'description']
            });

            if (!findDataWill) {
                return next(new Response404(Info.WILL_NOT_FOUND));
            }

            const findData: BookInterface[] = await BookModel.findAll({
                where, order: [['_id', 'DESC']], attributes: ['_id', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.BOOKS_NOT_FOUND));
            }

            return response.send(new Response200(Info.BOOKS_LIST, { will: findDataWill['dataValues'], books: findData }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listChapters = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: ChapterFindDto = request.body;
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
                where, order: [['chapter', 'ASC']], attributes: ['_id', 'chapter', 'willId', 'bookId', 'description']
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

    private listVerses = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: VerseFindDto = request.body;
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
                where: { _id: body.bookId }, attributes: ['_id', 'willId', 'name', 'description']
            });

            if (!findDataBook) {
                return next(new Response404(Info.BOOK_NOT_FOUND));
            }

            //search chapter
            const findDataChapter: ChapterInterface = await ChapterModel.findOne({
                where: { _id: body.chapterId }, attributes: ['_id', 'chapter', 'willId', 'bookId', 'description']
            });

            if (!findDataChapter) {
                return next(new Response404(Info.CHAPTER_NOT_FOUND));
            }

            const findData: VerseInterface[] = await VerseModel.findAll({
                where, order: [['verse', 'ASC']], attributes: ['_id', 'verse', 'chapterId', 'willId', 'bookId', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.VERSES_NOT_FOUND));
            }

            return response.send(new Response200(Info.VERSES_LIST, {
                will: findDataWill['dataValues'],
                book: findDataBook['dataValues'],
                chapter: findDataChapter['dataValues'],
                verses: findData
            }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listCountrys = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: CountryFindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: CountryInterface[] = await CountryModel.findAll({
                where, order: [['_id', 'DESC']],
                attributes: ['_id', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.COUNTRYS_NOT_FOUND));
            }

            return response.send(new Response200(Info.COUNTRYS_LIST, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listProvinces = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: ProvinceFindDto = request.body;
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

            return response.send(new Response200(Info.PROVINCES_LIST, { country: findDataCountry['dataValues'], provinces: findData }));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listChurches = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: ChurcheFindDto = request.body;
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

    private listCharges = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: ChargeFindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: ChargeInterface[] = await ChargeModel.findAll({
                where, order: [['_id', 'DESC']],
                attributes: ['_id', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.CHARGES_NOT_FOUND));
            }

            return response.send(new Response200(Info.CHARGES_LIST, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private listPreachers = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: PreacherFindDto = request.body;
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

    private listTeachings = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: TeachingFindDto = request.body;
            const where = { ...GetWhere(body) };

            const findData: TeachingInterface[] = await TeachingModel.findAll({
                where, order: [['_id', 'DESC']],
                attributes: ['_id', 'name', 'description']
            });
            if (findData && findData.length <= 0) {
                return next(new Response404(Info.TEACHINGS_NOT_FOUND));
            }

            return response.send(new Response200(Info.TEACHINGS_LIST, findData));
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

    private RegisterVerseRead = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const body: VerseReadCreateDto = request.body;
            const cultId = body.cultId;

            //search cult
            const findDataCult: CultInterface = await CultModel.findOne({ where: { _id: cultId }, attributes: ['_id', 'day', 'turn'] });
            if (findDataCult && findDataCult['dataValues']) {
                const info = findDataCult['dataValues'];
                if (!formatDate._CompareDateCult(info.day, info.turn)) {
                    return next(new Response404(Info.CULT_DATE_OUT));
                }
            }

            const countryId = body.countryId;
            const provinceId = body.provinceId;
            const churcheId = body.churcheId;
            const chargeId = body.chargeId;
            const preacherId = body.preacherId;
            const willId = body.willId;
            const bookId = body.bookId;
            const chapterId = body.chapterId;
            const verseId = body.verseId;
            const teachingId = body.teachingId;
            const coadjutorId = body.coadjutorId;

            //se valida si el versiculo existe, para el capitulo, libro y testamento
            const findDataVerse: VerseInterface = await VerseModel.findOne({
                where: { _id: verseId, willId, bookId, chapterId },
                attributes: ['_id']
            });

            if (!findDataVerse) {
                return next(new Response404(Info.VERSE_NOT_FOUND));
            }

            if (await VerseReadModel.findOne({
                where: {
                    cultId, countryId, provinceId, churcheId, chargeId, preacherId,
                    willId, bookId, chapterId, verseId, teachingId, coadjutorId
                }
            })) {
                return next(new AlreadyExistsException(`${Info.VERSE_READ_ALREADY} - cultId: ${cultId}, countryId: ${countryId}, provinceId: ${provinceId}, 
                churcheId: ${churcheId}, chargeId: ${chargeId}, preacherId: ${preacherId}, willId: ${willId},
                bookId: ${bookId}, chapterId: ${chapterId}, verseId: ${verseId}, teachingId: ${teachingId}, coadjutorId: ${coadjutorId}.`));
            } else {
                const saved = new VerseReadModel({
                    ...body,
                    //updatedBy: request.user.currentUser
                });
                const result = await saved.save();
                if (result && result['dataValues']) {
                    return response.send(new Response200(Info.VERSE_READ_REGISTRED, result));
                } else {
                    return next(new Response404(Info.VERSE_READ_NOT_REGISTRED));
                }
            }
        } catch (ex: any) {
            return next(new Response501(`${Info.SERVER_ERROR_INERNAL} - ${ex.message}`));
        }
    }

}