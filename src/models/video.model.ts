import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { videosAttributes } from './model.interface';


export class video extends Model<videosAttributes> { }

video.init(
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
        video_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('Completed', 'Incomplete')
        }
    },
    {
        sequelize: db,
        tableName: 'video',
    }
);