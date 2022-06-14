import { Association, DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { courseModule } from './courseModule.model';

export interface courseAttributes {
    course_id: number;
    title: string;
    description: string;
    status: Enumerator;
    thumbnail: string;
}

export class course extends Model<courseAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // console.log("came here");
        // define association here
        course.hasMany(models, { foreignKey: 'course_id', as: 'courseModules' });
    }


}


course.init(
    {
        course_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
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
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        }
    },
    {
        sequelize: db,
        tableName: 'courses'
    }
);
course.associate(courseModule);