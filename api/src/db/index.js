import sequelize from 'sequelize';
import dotenv from 'dotenv';
import { DB_NAME } from "../constant.js";

dotenv.config();
const sequelizeInstance = new sequelize.Sequelize(`${process.env.POSTGRES_CONNECTION_URI}/${DB_NAME}`,{
    dialect:"postgres",
    logging: false
});

export {sequelizeInstance};