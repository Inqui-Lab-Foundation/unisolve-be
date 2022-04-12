import { DataTypes, Model } from 'sequelize';
import db from '../../config/database.config';

export interface evaluatorAttributes {
    id: number;
    evaluator_name: string;
    mobile: number;
    email: string;
    status: Enumerator;
}

export class evaluator extends Model<evaluatorAttributes> { }

evaluator.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        evaluator_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type: DataTypes.BIGINT,
            allowNull: true,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            defaultValue: "Active"
        }
    },
    {
        sequelize: db,
        tableName: 'evaluator',
    }
);