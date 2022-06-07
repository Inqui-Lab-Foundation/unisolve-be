import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { module } from './module.model';

export interface courseAttributes {
    course_id: number;
    course_name: string;
    description: string;
    status: Enumerator;
    thumbnail: string;
}

export class course extends Model<courseAttributes> { }

course.init(
    {
        course_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        course_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thumbnail: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('Completed', 'Incomplete')
        }
    },
    {
        sequelize: db,
        tableName: 'courses'
    }
);

course.hasMany(module);