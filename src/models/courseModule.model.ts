import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { course } from './course.model';
import { courseModuleAttributes } from './model.interface';



export class courseModule extends Model<courseModuleAttributes> { 
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models:any) {
        // define association here
        courseModule.belongsTo(course,{foreignKey: 'course_id', as: 'course'});
      }
}

const courseModuleSequelize = courseModule.init(
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

