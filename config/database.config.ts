import { Sequelize } from 'sequelize';

const db = new Sequelize('dbunisolve', 'unisolvedbmaster', 'f1b(!3c8#pu2Jy45eFEo5O.}YcMO6?y2', {
    host: 'ls-26f6efb9ac86d2cc1ee72fb9e4d19e9b172da76d.chqqmkdqkqez.ap-south-1.rds.amazonaws.com',
    dialect: "mysql",
    logging: false,
});

export default db;
