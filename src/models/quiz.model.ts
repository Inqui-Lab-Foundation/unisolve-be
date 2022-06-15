import { DataTypes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import quizAttribute from '../interfaces/quiz.model.interface';
import db from '../utils/dbconnection.util';

export class quiz extends Model<quizAttribute> {
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

quiz.init(
    {
        quiz_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quiz_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        no_of_question: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cut_off: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        tableName: 'quizzes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
