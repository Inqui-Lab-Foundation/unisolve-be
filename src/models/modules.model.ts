import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface courseAttributes {
    id: number;
    course_id: string;
    description: string;
    status: Enumerator;
}

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
        tableName: 'modules',
    }
);