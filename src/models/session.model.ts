import { DataTypes, Model, UUIDV4 } from 'sequelize';
import db from '../../config/database.config';

export interface sessionAttributes {
    id: number;
    userId: string;
    valid: boolean;
    userAgent: string;
}

export class session extends Model<sessionAttributes> { }

session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        userId: DataTypes.STRING,
        userAgent: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: 'Sessions',
    }
);