import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface mentorAttributes {
    id: number;
    mentor_name: string;
    mobile: number;
    email: string;
    statue: Enumerator;
}

export class mentor extends Model<mentorAttributes> { }

mentor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mentor_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {   
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        statue: {
            type: DataTypes.ENUM('Active', 'Inactive')
        }
    },
    {
        sequelize: db,
        tableName: 'Mentors',
    }
);