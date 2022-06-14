import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { teamAttributes } from '../interfaces/model.interface';
import { constents } from '../configs/constents.config';

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
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        }
    },
    {
        sequelize: db,
        tableName: 'teams',
    }
);

