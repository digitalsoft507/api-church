// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Will } from './wills.model'

export class Book extends Model {
    public _id!: number;
    public name!: string;
    public description!: string;
    public status!: string;
    public willId!: number;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Book.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(15), //[ACTIVE | INACTIVE]
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
        tableName: "Books",
        sequelize: database, // this bit is important
    }
);

//Book.hasOne(Will);
//Will.belongsTo(Book);

Book.sync({ alter: true }).then(() => {
    //console.log("Book table created")
});