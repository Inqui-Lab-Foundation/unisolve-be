import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { course } from './course.model';
import { moduleAttributes } from './model.interface';



export class module extends Model<moduleAttributes> { }

module.init(
    {
        module_id: {
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

module.belongsTo(course, { foreignKey: 'course_id', targetKey: 'course_id' });