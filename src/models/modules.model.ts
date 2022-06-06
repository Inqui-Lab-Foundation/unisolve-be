import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { courseAttributes } from './model.interface';



export class modules extends Model<courseAttributes> { }

modules.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        course_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Completed', 'Incomplete')
        }
    },
    {
        sequelize: db,
        tableName: 'module',
    }
);