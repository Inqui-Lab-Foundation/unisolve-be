import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { constents } from '../configs/constents.config';
import db from '../utils/dbconnection.util';

export class challenge_response extends Model<InferAttributes<challenge_response>, InferCreationAttributes<challenge_response>> {
    declare challenge_response_id: CreationOptional<number>;
    declare challenge_id: ForeignKey<number>;
    declare team_id: ForeignKey<number>;
    declare idea_name: String;
    declare response: string;
    declare initiated_by: String;
    declare submitted_by: String;
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

challenge_response.init(
    {
        challenge_response_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        challenge_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idea_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        response: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        initiated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        submitted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(...Object.values(constents.challenges_flags.list)),
            allowNull: false,
            defaultValue: constents.challenges_flags.default
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
        tableName: 'challenge_responses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

//todo: add associations.. here 
