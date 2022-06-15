import { DataTypes, Model, Attributes } from 'sequelize';
import bcrypt from 'bcrypt';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { notification } from './notification.model';
import { baseConfig } from '../configs/base.config';
export interface userAttributes {
    user_id: string;
    email: string;
    password: string;
    full_name: string;
    image: string,
    date_of_birth: Date;
    mobile: number;
    team_id: string;
    org_name: string;
    qualification: string;
    stream: string;
    city: string;
    district: string;
    state: string;
    country: string;
    role: string;
    is_loggedin: Enumerator;
    last_login: number;
    status: Enumerator;
    created_by: number;
    updated_by: number;
}

export class user extends Model<userAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        user.hasMany(notification, { sourceKey: 'notification_id', as: 'notifications' });

    }

    // static toJSON(user: userAttributes) {
    //     return {
    //         user_id: user.user_id,
    //         email: user.email,
    //         password: user.password,
    //         full_name: user.full_name,
    //         image: user.image,
    //         date_of_birth: user.date_of_birth,
    //         mobile: user.mobile,
    //         team_id: user.team_id,
    //         org_name: user.org_name,
    //         qualification: user.qualification,
    //         stream: user.stream,
    //         city: user.city,
    //         district: user.district,
    //         state: user.state,
    //         country: user.country,
    //         role: user.role,
    //         is_loggedin: user.is_loggedin,
    //         last_login: user.last_login,
    //         status: user.status,
    //         created_by: user.created_by,
    //         updated_by: user.updated_by,

    // }
}

user.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(55),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // select: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        team_id: {
            type: DataTypes.STRING,
        },
        org_name: {
            type: DataTypes.STRING,
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stream: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
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
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            defaultValue: constents.common_status_flags.default
        },
        role: {
            type: DataTypes.ENUM(...Object.values(constents.user_role_flags.list)),
            defaultValue: constents.user_role_flags.default
        },
        is_loggedin: {
            type: DataTypes.ENUM(...Object.values(constents.common_yes_no_flags.list)),
            defaultValue: constents.common_yes_no_flags.default
        },
        last_login: {
            type: DataTypes.DATE
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        updated_by: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize: db,
        tableName: 'users',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        hooks: {
            beforeCreate: async (user:any) => {
                if (user.password) {
                    user.password = bcrypt.hashSync(user.password, process.env.SALT || baseConfig.SALT);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    user.password = bcrypt.hashSync(user.password, process.env.SALT || baseConfig.SALT);
                }
            }
        }
    }
);