// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Country } from './countrys.model'

export class Province extends Model {
    public _id!: number;
    public name!: string;
    public countryId!: number;
    public description!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Province.init(
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
        tableName: "Provinces",
        sequelize: database, // this bit is important
    }
);

Province.sync({ alter: false }).then(() => {
    //console.log("Province table created")
});