import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { courseModule } from './courseModule.model';

export interface courseAttributes {
    course_id: number;
    course_name: string;
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
        console.log("came here");
        // define association here
        course.hasMany(courseModule,{foreignKey: 'course_id', as: 'courseModules'});
    }
}
 

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

// course.hasMany(courseModule);