// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Charge } from './charges.model'

export class Preacher extends Model {
    public _id!: number;
    public firstName!: string;
    public lastName!: string;
    public email: string;
    public phone: string;
    public description!: string;
    public status!: string;
    public chargeId!: number;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Preacher.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(15), //[ACTIVE | INACTIVE]
            allowNull: false,
        },
        chargeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Charge,
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
        tableName: "Preachers",
        sequelize: database, // this bit is important
    }
);

Preacher.sync({ alter: false }).then(() => {
    //console.log("Preacher table created")
});