import { Sequelize } from 'sequelize';
import prodDb from './productions';
import devDb from './development';

let credentials: any;

if (process.env.NODE_ENV === 'development') {
    credentials = devDb;
    console.log('Targeted Database: DEVELOPMENT:local');
}
if (process.env.NODE_ENV === 'production') {
    credentials = devDb; //prodDb;
    console.log('Targeted Database: PRODUCTION:remote(AWS Database') ;
}
if (process.env.NODE_ENV === 'test') {
    credentials = devDb;
    console.log('Targeted Database: QA:local');
}

const database = new Sequelize(credentials.databaseName, credentials.userName, credentials.password, {
    host: credentials.hostName,
    dialect: "mysql",
    logging: false,
});

export default database;
