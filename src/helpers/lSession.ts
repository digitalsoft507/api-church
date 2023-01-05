import { Session as SessionModel } from '../modelsSequelize/sessions.model';
import { formatDate } from './formatDate';

export namespace Session {

    export const CreateSession = async (Token: string, Email: string, IdUser: number, Access: string) => {
        try {
            const FechaHoraStart = formatDate._currentDateTime();
            const FechaHoraEnd = formatDate._currentDateTimePlus6();

            const obj = new SessionModel({
                Email,
                IdUser,
                Token,
                Access,
                FechaHoraStart,
                FechaHoraEnd
            })
            const response = await obj.save();

            return true;
        } catch (ex) {
            return false;
        }
    }

    export const FilterSessionByUsername = async (Email: string, IdUser: number) => {
        try {
            const session = await SessionModel.findOne({ where: { Email, IdUser }, raw: true });

            if (session) {
                return { ...session, code: 200 };
            }

            return null;
        } catch (ex) {
            return null;
        }
    }

    export const FilterSessionByToken = async (Token: string, Access: string) => {
        try {
            const session = await SessionModel.findOne({ where: { Token, Access }, raw: true });
            
            if (session) {
                return { ...session, code: 200 };
            }

            return null;
        } catch (ex) {
            return null;
        }
    }

    export const UpdateDateSession = async (Email: string) => {
        try {
            const session = await SessionModel.findOne({ where: { Email }, raw: true });

            if (session) {
                return { ...session, code: 200 };
            }

            return null;
        } catch (ex) {
            return null;
        }
    }

    export const UpdateToken = async (Token: string, Email: string, IdUser: number) => {
        try {
            const currentDateTime = formatDate._currentDateTime();
            const FechaHoraStart = formatDate._currentDateTime();
            const FechaHoraEnd = formatDate._currentDateTimePlus6();

            const session = await SessionModel.update({
                Token,
                FechaHoraStart,
                FechaHoraEnd,
                updatedAt: currentDateTime
            }, { where: { Email, IdUser }});

            if (session) {
                return { ...session, code: 200 };
            }

            return null;
        } catch (ex) {
            return null;
        }
    }

}
