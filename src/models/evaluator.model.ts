import { DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { evaluatorAttributes } from './model.interface';

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
        organization: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
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