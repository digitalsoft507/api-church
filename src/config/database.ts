import { Sequelize } from "sequelize";

const {
    HOST_POSTGRES,
    DB_USERNAME,
    DB_PASSWORD,
    DB_MAIN
} = process.env;

export const database = new Sequelize(DB_MAIN, DB_USERNAME, DB_PASSWORD, {
    dialect: "postgres",
    host: HOST_POSTGRES,
    port: 5433,
    logging: false
});

