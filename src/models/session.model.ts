import { DataTypes, Model, UUIDV4 } from 'sequelize';
import db from '../../config/database.config';

export interface sessionAttributes {
    id: number;
    userId: string;
    valid: boolean;
    userAgent: string;
}

export class session extends Model<sessionAttributes> { }

session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        userId: DataTypes.STRING,
        userAgent: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: 'sessions',
    }
);

/**
 * import mongoose from 'mongoose';
import { userDocument } from './user.model'

export interface sessionDocument extends mongoose.Document {
    user: userDocument["_id"];
    valid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String }
}, { timestamps: true });

const sessionModel = mongoose.model<sessionDocument>("Session", sessionSchema);

export default sessionModel;
 */