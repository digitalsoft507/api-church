// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Session extends Model {
    public Id!: number;
    public FechaHoraStart!: Date;
    public FechaHoraEnd!: Date;
    public Email!: String;
    public IdUser!: number;
    public Token!: String;
    public Access!: String;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

Session.init(
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        FechaHoraStart: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        FechaHoraEnd: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        IdUser: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Token: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        Access: { // [app, admin]
            type: DataTypes.STRING(15),
            allowNull: false,
        },
    },
    {
        tableName: "Sessions",
        sequelize: database, // this bit is important
    }
);

Session.sync({ alter: false }).then(() => {
    //console.log("Session table created")
});