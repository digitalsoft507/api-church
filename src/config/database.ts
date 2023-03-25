require('./define');
import { Sequelize } from "sequelize";

const { HOST_POSTGRES, DB_USERNAME, DB_PASSWORD, DB_MAIN } = process.env;

console.log(`## RUN ENVIRONMENT: ${process.env.NODE_ENV}, HOST_POSTGRES: ${HOST_POSTGRES}, DB_USERNAME: ${DB_USERNAME}, DB_PASSWORD: ${DB_PASSWORD}, DB_MAIN: ${DB_MAIN} ##`);

export const database = new Sequelize(DB_MAIN, DB_USERNAME, DB_PASSWORD, {
    dialect: "postgres",
    host: HOST_POSTGRES,
    port: 5433,
    logging: false
});

