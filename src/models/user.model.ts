import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';

export interface userAttributes {
    id: string;
    name: string;
    mobile: number;
    email: string;
    password: string;
    org: string;
    role: Enumerator;
    status: Enumerator;
}

export class user extends Model<userAttributes> { }

user.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false
        },
        mobile: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: true
        },
        org: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive')
        }
    },
    {
        sequelize: db,
        tableName: 'user',
    }
);