import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface mentorAttributes {
    id: number;
    mentor_name: string;
    mobile: number;
    email: string;
    status: Enumerator;
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
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            defaultValue: "Active"
        }
    },
    {
        sequelize: db,
        tableName: 'mentor',
    }
);