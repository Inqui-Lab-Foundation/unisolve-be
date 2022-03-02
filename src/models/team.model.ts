import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface teamAttributes {
    id: number;
    team_name: string;
    mentor_id: string;
    statue: Enumerator;
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
        statue: {
            type: DataTypes.ENUM('Active', 'Inactive')
        }
    },
    {
        sequelize: db,
        tableName: 'Teams',
    }
);