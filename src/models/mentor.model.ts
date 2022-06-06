import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { mentorAttributes } from './model.interface';


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