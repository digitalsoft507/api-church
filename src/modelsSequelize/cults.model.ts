// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { } from './countrys.model'
import { Country } from './countrys.model'
import { Province } from './provinces.model'
import { Churche } from './churches.model'
import { Teaching } from './teachings.model'
import { Coadjutor } from './coadjutors.model'

export class Cult extends Model {
    public _id!: number;
    public day: string;
    public turn: string; // morning || afternoon || night
    public countryId: number;
    public provinceId: number;
    public churcheId: number;
    public teachingId: number;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Cult.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        day: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        turn: {// morning || afternoon || night
            type: DataTypes.STRING,
            allowNull: false
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
        teachingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Teaching,
                key: '_id'
            }
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
        tableName: "Cults",
        sequelize: database, // this bit is important
    }
);

Cult.sync({ alter: false }).then(() => {
    //console.log("Cult table created")
});