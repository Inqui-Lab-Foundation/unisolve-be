import { DataTypes, Model, UUIDV4 } from 'sequelize';
import bcrypt from 'bcrypt'
import db from '../../config/database.config';

export interface studentAttributes {
    id: string;
    name: string;
    email: string,
    password: string
}

export class student extends Model<studentAttributes> { }

student.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: function () {
                return generateMyId()
            },
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        hooks: {
            beforeCreate: async (user, option) => {
                if (user.getDataValue('password')) {
                    const salt = await bcrypt.genSaltSync(10, 'a');
                    const hashPassword = bcrypt.hashSync(user.getDataValue('password'), salt);
                    user.setDataValue('password', hashPassword)
                }
            }
        },
        sequelize: db,
        tableName: 'students',
    }
);

export const correctPassword = (enteredPassword: string, originalPassword: string) => {
    return bcrypt.compareSync(enteredPassword, originalPassword);
}

function generateMyId() {
    return UUIDV4;
}

