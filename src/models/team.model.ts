import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface teamAttributes {
    id: number;
    team_name: string;
    mentor_id: string;
    status: Enumerator;
}

export class teams extends Model<teamAttributes> { }

teams.init(
    {
        id: {
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
        tableName: 'team',
    }
);