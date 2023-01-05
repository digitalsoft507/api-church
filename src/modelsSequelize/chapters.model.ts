// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Will } from './wills.model'
import { Book } from './books.model'

export class Chapter extends Model {
    public _id!: number;
    public chapter!: number;
    public willId!: number;
    public bookId!: number;
    public description!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Chapter.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        chapter: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
            type: DataTypes.STRING(255),
            allowNull: false,
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
        tableName: "Chapters",
        sequelize: database, // this bit is important
    }
);

Chapter.sync({ alter: false }).then(() => {
    //console.log("Chapter table created")
});