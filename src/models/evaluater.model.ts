import { DataTypes, Model, Attributes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { notification } from './notification.model';
import { baseConfig } from '../configs/base.config';
import { user } from './user.model';

export class evaluater extends Model<InferAttributes<evaluater>, InferCreationAttributes<evaluater>> {
    declare evaluater_id: CreationOptional<number>;
    declare user_id: string;
    declare full_name: string;
    declare date_of_birth: Date;
    declare organization_name: string;
    declare qualification: string;
    declare city: string;
    declare district: string;
    declare state: string;
    declare country: string;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
        // define association here
        evaluater.hasMany(notification, { sourceKey: 'notification_id', as: 'notifications' });
    }
}

evaluater.init(
    {
        evaluater_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        organization_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: true
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
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            onUpdate: new Date().toLocaleString()
        }
    },
    {
        sequelize: db,
        tableName: 'evaluaters',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        hooks: {
            beforeCreate: async (user: any) => {
                if (user.password) {
                    user.password = await bcrypt.hashSync(user.password, process.env.SALT || baseConfig.SALT);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hashSync(user.password, process.env.SALT || baseConfig.SALT);
                }
            }
        }
    }
);

// evaluater.belongsTo(user, { foreignKey: 'user_id', constraints: false });
// user.hasOne(evaluater, { foreignKey: 'user_id', constraints: false, scope: { role: 'EVALUATER' } });
//evaluater association
user.hasOne(evaluater, {
    foreignKey: 'user_id',
    constraints: false
});
evaluater.belongsTo(user, {
    foreignKey: 'user_id',
    constraints: false,
    scope: {
        role: 'EVALUATER'
    }
})