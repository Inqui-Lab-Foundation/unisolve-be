import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { videosAttributes } from '../interfaces/model.interface';
import { constents } from '../configs/constents.config';


export class video extends Model<videosAttributes> { }

video.init(
    {
        video_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        module: {
            type: DataTypes.STRING,
            allowNull: false
        },
        video_stream_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        }
    },
    {
        sequelize: db,
        tableName: 'videos',
    }
);