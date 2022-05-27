import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface courseAttributes {
    id: number;
    course_name: string;
    description: string;
    status: Enumerator;
    Thumbnail: string;
}

export class course extends Model<courseAttributes> { }

course.init(
    {
        id: {
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
        Thumbnail: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('Completed', 'Incomplete')
        }
    },
    {
        sequelize: db,
        tableName: 'course',
    }
);