import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { course } from './course.model';
import { courseModuleAttributes } from '../interfaces/model.interface';
import { constents } from '../configs/constents.config';



export class courseModule extends Model<courseModuleAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        courseModule.belongsTo(models, { foreignKey: 'course_id', as: 'course' });
    }
}

const courseModuleSequelize = courseModule.init(
    {
        module_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.task_status_flags.list)),
            defaultValue: constents.task_status_flags.default
        }
    },
    {
        sequelize: db,
        tableName: 'course_modules',
        timestamps: true,
        createdAt: 'created_At',
        updatedAt: 'updated_At'
    }
);

// courseModule.associate(course);
