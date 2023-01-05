// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Will } from './wills.model'
import { Book } from './books.model'
import { Chapter } from './chapters.model'

export class Verse extends Model {
    public _id!: number;
    public verse!: number;
    public chapterId!: number;
    public willId!: number;
    public bookId!: number;
    public description!: string;
    public title: string;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Verse.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        verse: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Chapter,
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
        description: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(15), //[ACTIVE | INACTIVE]
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.JSON,
            allowNull: false
        },
        updatedBy: {
            type: DataTypes.JSON,
            allowNull: false
        },
    },
    {
        tableName: "Verses",
        sequelize: database, // this bit is important
    }
);

Verse.sync({ alter: false }).then(() => {
    //console.log("Verse table created")
});