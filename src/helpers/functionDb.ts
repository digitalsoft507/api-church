import { Op } from 'sequelize';

export const GetWhere = (body: any) => {
    let where = {};
    for (var key in body) {
        if (key !== 'dateStart' && key !== 'dateEnd' && key !== 'limit') {
            const item = { [key]: body[key] };
            where = { ...where, ...item };
        }
    }

    return where;
}

export const GetWhereWithDate = (body: any, where: any) => {
    const dateStart = body.dateStart;
    const dateEnd = body.dateEnd;

    if (dateStart && dateEnd) {
        where = { ...where, createdAt: { [Op.between]: [dateStart, dateEnd] } };
    }

    return where;
}