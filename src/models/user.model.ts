import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
export interface userAttributes {
    id: string;
    email: string;
    password: string;
    full_name: string;
    image: string,
    date_of_birth: Date;
    mobile: number;
    team_id: string;
    org_name: string;
    qualification: string;
    stream: string;
    city: string;
    district: string;
    state: string;
    country: string;
    role: string;
    is_loggedin: Enumerator;
    last_login: number;
    status: Enumerator;
    created_by: number;
    updated_by: number;
}

export class user extends Model<userAttributes> { }

user.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(55),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        team_id: {
            type: DataTypes.STRING,
        },
        org_name: {
            type: DataTypes.STRING,
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stream: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        district: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue: 'ACTIVE'
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'EVALUATER', 'MENTOR', 'STUDENT'),
            defaultValue: 'ADMIN'
        },
        is_loggedin: {
            type: DataTypes.ENUM('YES', 'NO'),
            defaultValue: 'NO'
        },
        last_login: {
            type: DataTypes.DATE
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        updated_by: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize: db,
        tableName: 'user',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);