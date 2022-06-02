import { Sequelize } from 'sequelize';
import prodDb from './productions';
import devDb from './development';
let credentials: any;

if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'development'
}

if (process.env.NODE_ENV === 'development') {
    credentials = devDb;
    console.log('using the local Database');
}
if (process.env.NODE_ENV === 'production') {
    credentials = prodDb;
    console.log('connected to AWS Database');
}
if (process.env.NODE_ENV === 'test') {
    credentials = devDb;
    console.log('using the local Database')
}

const database = new Sequelize(credentials.databaseName, credentials.userName, credentials.password, {
    host: credentials.hostName,
    dialect: credentials.dialect,
    logging: false,
});

export default database;
