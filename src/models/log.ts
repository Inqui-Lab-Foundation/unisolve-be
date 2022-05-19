import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface loggerAttributes {
    id: number;
    api_name: string;
    request_method: string;
    request: string;
    response: string;
    status: Enumerator | String;
}

export class logToDatabase extends Model<loggerAttributes> { }

logToDatabase.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        api_name: {
            type: DataTypes.STRING
        },
        request_method: {
            type: DataTypes.STRING
        },
        request: {
            type: DataTypes.STRING,
        },
        response: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('success', 'failed'),
            defaultValue: 'failed'
        }
    },
    {
        sequelize: db,
        tableName: 'log',
    }
);

