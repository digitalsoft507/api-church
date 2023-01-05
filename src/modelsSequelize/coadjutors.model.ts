

// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Coadjutor extends Model {
    public _id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public cellPhone: string;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

Coadjutor.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        cellPhone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(15), //[ACTIVE | INACTIVE]
            allowNull: false
        },
    },
    {
        tableName: "Coadjutors",
        sequelize: database, // this bit is important
    }
);

Coadjutor.sync({ alter: false }).then(() => {
    //console.log("Coadjutor table created")
});