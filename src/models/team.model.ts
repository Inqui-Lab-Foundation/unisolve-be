import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { teamAttributes } from './model.interface';

export class teams extends Model<teamAttributes> { }

teams.init(
    {
        team_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        team_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mentor_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive')
        }
    },
    {
        sequelize: db,
        tableName: 'teams',
    }
);

