import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import questionAttribute from '../interfaces/question.model.interface';
import db from '../utils/dbconnection.util';
import { quiz } from './quiz.model';
import { quiz_survey } from './quiz_survey.model';

export class quiz_survey_question extends Model<InferAttributes<quiz_survey_question>, InferCreationAttributes<quiz_survey_question>> {
    declare quiz_survey_question_id: CreationOptional<number>;
    declare quiz_survey_id: ForeignKey<number>;
    declare question_no: number;
    declare question: string;
    declare option_a: string;
    declare option_b: string;
    declare option_c: string;
    declare option_d: string;
    declare correct_ans: string;
    declare level: Enumerator;
    declare type: Enumerator;
    declare msg_ans_correct: string;
    declare msg_ans_wrong: string;
    declare question_image: string;
    declare redirect_to: ForeignKey<number>;
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

quiz_survey_question.init(
    {
        quiz_survey_question_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quiz_survey_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_no: {
            type: DataTypes.INTEGER,
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
        level: {
            type: DataTypes.ENUM(...Object.values(constents.quiz_question_level_flags.list)),
            allowNull: false,
            defaultValue: constents.quiz_question_level_flags.default
        },
        type: {
            type: DataTypes.ENUM(...Object.values(constents.quiz_question_type_flags.list)),
            allowNull: false,
            defaultValue: constents.quiz_question_type_flags.default
        },
        redirect_to: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        question_image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        msg_ans_correct: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        msg_ans_wrong: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
            allowNull: false,
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
        tableName: 'quiz_survey_questions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

quiz_survey_question.belongsTo(quiz_survey, { foreignKey: 'quiz_survey_id' })
quiz_survey.hasMany(quiz_survey_question, { foreignKey: 'quiz_survey_id' })
