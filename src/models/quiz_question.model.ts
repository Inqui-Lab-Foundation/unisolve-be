import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import questionAttribute from '../interfaces/question.model.interface';
import db from '../utils/dbconnection.util';
import { quiz } from './quiz.model';

export class quiz_question extends Model<InferAttributes<quiz_question>,InferCreationAttributes<quiz_question>> {
   declare quiz_question_id: CreationOptional<number>;
   declare quiz_id: ForeignKey<number>;
   declare category: string | null;
   declare question: string;
   declare option_a: string;
   declare option_b: string;
   declare option_c: string;
   declare option_d: string;
   declare correct_ans: string;
   declare level: Enumerator;
   declare redirect_to: CreationOptional<number>;
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
    // static associate(models: any) {
    //     // define association here
    //     notification.belongsTo(user, { foreignKey: 'created_by', as: 'user' });
    // }
}

quiz_question.init(
    {
        quiz_question_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quiz_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_a: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_b: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_c: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        option_d: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        correct_ans: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        redirect_to: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        level: {
            type: DataTypes.ENUM(...Object.values(constents.quiz_question_level_flags.list)),
            allowNull: false,
            defaultValue: constents.quiz_question_level_flags.default
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            allowNull: false,
            defaultValue: constents.common_status_flags.default
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:null
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
        tableName: 'quiz_questions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

quiz_question.belongsTo(quiz,{foreignKey:'quiz_id'})
quiz.hasMany(quiz_question,{foreignKey:'quiz_id'})
