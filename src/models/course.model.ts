import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface coursesAttributes {
    id: number;
    module: string;
    courser_id: string;
    statue: Enumerator;
}

export class courses extends Model<coursesAttributes> { }

courses.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        module: {
            type: DataTypes.STRING,
            allowNull: false
        },
        courser_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        statue: {
            type: DataTypes.ENUM('Completed', 'Incomplete')
        }
    },
    {
        sequelize: db,
        tableName: 'Courses',
    }
);