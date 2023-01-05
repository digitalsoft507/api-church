// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Profiles extends Model {
    public _id!: number;
    public name!: string;
    public roles!: any;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

Profiles.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        roles: {
            type: DataTypes.ARRAY(DataTypes.STRING(40)),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(15), //[ACTIVE | INACTIVE]
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.JSON,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.JSON,
            allowNull: true
        },
    },
    {
        tableName: "Profiles",
        sequelize: database, // this bit is important
    }
);

Profiles.sync({ alter: false }).then(() => {
    //console.log("Profiles table created")
});