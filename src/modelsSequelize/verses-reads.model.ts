// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Cult } from './cults.model'
import { Country } from './countrys.model'
import { Province } from './provinces.model'
import { Churche } from './churches.model'
import { Charge } from './charges.model'
import { Preacher } from './preachers.model'
import { Will } from './wills.model'
import { Book } from './books.model'
import { Chapter } from './chapters.model'
import { Verse } from './verses.model'
import { Teaching } from './teachings.model'
import { Coadjutor } from './coadjutors.model'

export class VerseRead extends Model {
    public _id!: number;

    public cultId!: number;

    public countryId!: number;
    public provinceId!: number;

    public churcheId!: number;
    public chargeId!: number;
    public preacherId!: number;

    public willId!: number;
    public bookId!: number;
    public chapterId!: number;
    public verseId!: number;

    public teachingId!: number;
    public coadjutorId!: number;

    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

VerseRead.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cultId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Cult,
                key: '_id'
            }
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Country,
                key: '_id'
            }
        },
        provinceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Province,
                key: '_id'
            }
        },
        churcheId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Churche,
                key: '_id'
            }
        },
        chargeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Charge,
                key: '_id'
            }
        },
        preacherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Preacher,
                key: '_id'
            }
        },
        willId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Will,
                key: '_id'
            }
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Book,
                key: '_id'
            }
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Chapter,
                key: '_id'
            }
        },
        verseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Verse,
                key: '_id'
            }
        },
        teachingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Teaching,
                key: '_id'
            }
        },
        coadjutorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Coadjutor,
                key: '_id'
            }
        }
    },
    {
        tableName: "VersesReads",
        sequelize: database, // this bit is important
    }
);

VerseRead.sync({ alter: false }).then(() => {
    //console.log("VerseRead table created")
});