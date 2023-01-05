// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";


export class Roles extends Model {
    public _id!: number;
    public name!: string;
    public code!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

Roles.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(40),
            allowNull: false,
        }
    },
    {
        tableName: "Roles",
        sequelize: database, // this bit is important
    }
);

Roles.sync({ alter: false }).then(() => {
    //console.log("Roles table created")
});