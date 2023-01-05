// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Country } from './countrys.model'
import { Province } from './provinces.model'

export class Churche extends Model {
    public _id!: number;
    public name!: string;
    public description!: string;
    public status!: string;
    public countryId!: number;
    public provinceId!: number;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Churche.init(
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
        tableName: "Churches",
        sequelize: database, // this bit is important
    }
);

Churche.sync({ alter: false }).then(() => {
    //console.log("Churche table created")
});