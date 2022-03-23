import { DataTypes, Model, UUIDV4 } from 'sequelize';
import bcrypt from 'bcrypt'
import db from '../../config/database.config';

export interface studentAttributes {
    id: string;
    team_id: string;
    student_name: string;
    mobile: number;
    email: string;
    password: string;
    date_of_birth: string;
    institute_name: string;
    stream: string;
    city: string;
    district: string;
    state: string;
    country: string;
    statue: Enumerator;
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
        team_id: {
            type: DataTypes.STRING
        },
        student_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        institute_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stream: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING,
        },
        district: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        statue: {
            type: DataTypes.ENUM('Active', 'Inactive')
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
        tableName: 'Students',
    }
);

function generateMyId() {
    return UUIDV4;
}
