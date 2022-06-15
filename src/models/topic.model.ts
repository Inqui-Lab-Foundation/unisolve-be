import { DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import topicAttributes from '../interfaces/topic.model.interface';
import db from '../utils/dbconnection.util';
import { user } from './user.model';

export class topic extends Model<topicAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models: any) {
    //     // define association here
    //     notification.belongsTo(user, { foreignKey: 'created_by', as: 'user' });
    // }
}


topic.init(
    {
        topic_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        module_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        topic_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        topic_type: {
            type: DataTypes.ENUM(...Object.values(constents.topic_type_flags.list)),
            allowNull: false,
            defaultValue: constents.topic_type_flags.default
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            allowNull: false,
            defaultValue: constents.common_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
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
        tableName: 'topics',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
