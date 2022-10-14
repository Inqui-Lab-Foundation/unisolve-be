import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';
import { challenge } from './challenge.model';

export class challenge_question extends Model<InferAttributes<challenge_question>, InferCreationAttributes<challenge_question>> {
    declare challenge_question_id: CreationOptional<number>;
    declare challenge_id: ForeignKey<number>;
    declare question_no: number;
    declare question: string;
    declare description: string;
    declare option_a: string;
    declare option_b: string;
    declare option_c: string;
    declare option_d: string;
    declare correct_ans: string;
    declare type: Enumerator;
    declare status: Enumerator;
    declare created_by: number;
    declare created_at: Date;
    declare updated_by: number;
    declare updated_at: Date;
    // declare level: Enumerator;
    // declare msg_ans_correct: string;
    // declare msg_ans_wrong: string;
    // declare question_image: string;
    // declare question_icon: string;
    // declare redirect_to: ForeignKey<number>;
    // declare ar_image_ans_correct: string;
    // declare ar_video_ans_correct: string;
    // declare accimg_ans_correct: string;
    // declare ar_image_ans_wrong: string;
    // declare ar_video_ans_wrong: string;
    // declare accimg_ans_wrong: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models: any) {
    //     // define association here
    //     notification.belongsTo(user, { foreignKey: 'created_by', as: 'user' });
    // }
    // ar_image_ans_correct
    // ar_video_ans_correct
    // accimg_ans_correct
    // ar_image_ans_wrong
    // ar_video_ans_wrong
    // accimg_ans_wrong
}

challenge_question.init(
    {
        challenge_question_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        challenge_id: {
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
        description: {
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
        type: {
            type: DataTypes.ENUM(...Object.values(constents.quiz_question_type_flags.list)),
            allowNull: false,
            defaultValue: constents.quiz_question_type_flags.default
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
        // level: {
        //     type: DataTypes.ENUM(...Object.values(constents.quiz_question_level_flags.list)),
        //     allowNull: false,
        //     defaultValue: constents.quiz_question_level_flags.default
        // },
        // redirect_to: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true
        // },
        // question_image: {
        //     type: DataTypes.TEXT,
        //     allowNull: true,
        // },
        // question_icon: {
        //     type: DataTypes.TEXT,
        //     allowNull: true,
        // },
        // ar_image_ans_correct: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // ar_video_ans_correct: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // accimg_ans_correct: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // ar_image_ans_wrong: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // ar_video_ans_wrong: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // accimg_ans_wrong: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // msg_ans_correct: {
        //     type: DataTypes.TEXT,
        //     allowNull: true,
        //     defaultValue: "",
        // },
        // msg_ans_wrong: {
        //     type: DataTypes.TEXT,
        //     allowNull: true,
        //     defaultValue: "",
        // }
    },
    {
        sequelize: db,
        tableName: 'challenge_questions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

challenge_question.belongsTo(challenge, { foreignKey: 'challenge_id' })
challenge.hasMany(challenge_question, { foreignKey: 'challenge_id' })
