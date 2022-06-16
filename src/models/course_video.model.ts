import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { courseVideosAttributes } from '../interfaces/model.interface';
import { constents } from '../configs/constents.config';


export class course_video extends Model<courseVideosAttributes> { }

course_video.init(
    {
        course_video_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        video_stream_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
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
        tableName: 'videos',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);