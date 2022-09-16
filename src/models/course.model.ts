import { Association, DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { course_module } from './course_module.model';
import translation from '../../resources/static/uploads/te/translation'


export interface courseAttributes {
    course_id: number;
    title: string;
    description: string;
    status: Enumerator;
    thumbnail: string;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

export class course extends Model<courseAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static locale = 'tn';
    // constructor(locale: any) {
    //     super();
    //     locale = this.locale;
    // }
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
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        thumbnail: {
            type: DataTypes.STRING,
            defaultValue: constents.default_image_path
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            onUpdate: new Date().toLocaleString()
        }
    },
    {
        sequelize: db,
        tableName: translation[course.locale].COURSES,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);
//course.associate(course_module);