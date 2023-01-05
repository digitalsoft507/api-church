

// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class User extends Model {
    public _id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public profile!: number;
    public status!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
    public createdBy!: JSON;
    public updatedBy!: JSON;
}

User.init(
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
        profile: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(15), //[ACTIVE | INACTIVE]
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.JSON, //STRING(255),
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.JSON, //STRING(255),
            allowNull: true
        },
    },
    {
        tableName: "Users",
        sequelize: database, // this bit is important
    }
);

User.sync({ alter: false }).then(() => {
    //console.log("User table created")
});