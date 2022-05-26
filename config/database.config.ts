import { Sequelize } from 'sequelize';
import logger from '../src/utils/logger';
import prodDb from './productions';
import devDb from './development';
let credentials: any;

if (process.env.NODE_ENV === 'production') {
    credentials = prodDb;
    console.log('connected to AWS Database');
}else{
    console.log('using the local Database');
    credentials = devDb;
}

const database = new Sequelize(credentials.databaseName, credentials.userName, credentials.password, {
    host: credentials.hostName,
    dialect: credentials.dialect,
    logging: false,
});

export default database;
