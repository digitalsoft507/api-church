import * as day from 'dayjs';
var moment = require('moment');
export namespace formatDate {

    export const _mm_dd_yyyy = (date: string) => {
        return day(date).format("MM/DD/YYYY");
    }

    export const _dd_mm_yyyy = (date: string) => {
        return day(date).format("DD/MM/YYYY");
    }

    export const _all = (date: string) => {
        return day(date).format('MMMM DD, hh:mm A');
    }

    export const _hour = (date: string) => {
        return day(date).format('MMM DD, hh:mm a');
    }

    export const _currentDate = () => {
        let date = moment().format();
        date = moment.tz(date, 'America/Bogota').format("YYYY-MM-DD").toString("YYYY-MM-DD");

        return date;
    }

    export const _currentDateTime = () => {
        let dateTime = moment().format();
        dateTime = moment.tz(dateTime, 'America/Bogota')
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString("YYYY-MM-DDTHH:mm:ss");

        return dateTime;
    }

    export const _currentDateTimePlus6 = () => {
        let dateTime = moment().format();
        dateTime = moment.tz(dateTime, 'America/Bogota')
            .add(6, 'hours')       //.add(30, 'seconds') //
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString("YYYY-MM-DDTHH:mm:ss");

        return dateTime;
    }

    export const _currentDateTimeLess5 = (dateTime: any) => {
        dateTime = moment.tz(dateTime, 'America/Bogota')
            .utcOffset('-05:00:00')
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString("YYYY-MM-DDTHH:mm:ss");

        return dateTime;
    }

    export const _CompareDateCult = (day: string, turn: string) => {

        //first valid currentDate
        const currentDate = moment.tz(day, 'America/Bogota').format("YYYY-MM-DD").toString("YYYY-MM-DD");
        if (day !== currentDate) {
            return false;
        }

        const currentTime = moment.tz(new Date(), 'America/Bogota').format("YYYY-MM-DDTHH:mm:ss").toString("YYYY-MM-DDTHH:mm:ss");
        if (turn === 'day') {
            const dayHourStart = moment.tz(`${day}T06:00:00`, 'America/Bogota').format("YYYY-MM-DDTHH:mm:ss").toString("YYYY-MM-DDTHH:mm:ss");
            const dayHourEnd = moment.tz(`${day}T14:59:59`, 'America/Bogota').format("YYYY-MM-DDTHH:mm:ss").toString("YYYY-MM-DDTHH:mm:ss");
            return moment(currentTime).isBetween(dayHourStart, dayHourEnd);
        }

        if (turn === 'night') {
            const dayHourStart = moment.tz(`${day}T15:00:00`, 'America/Bogota').format("YYYY-MM-DDTHH:mm:ss").toString("YYYY-MM-DDTHH:mm:ss");
            const dayHourEnd = moment.tz(`${day}T23:59:59`, 'America/Bogota').format("YYYY-MM-DDTHH:mm:ss").toString("YYYY-MM-DDTHH:mm:ss");
            return moment(currentTime).isBetween(dayHourStart, dayHourEnd);
        }

        return true;
    }

}
