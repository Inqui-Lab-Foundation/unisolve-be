
import {  DataTypes, Model } from 'sequelize';
import db from '../utils/dbconnection.util';
import { userCtopicProgressAttributes } from '../interfaces/model.interface';

export class user_ctopic_progress extends Model<userCtopicProgressAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The "models/index" file will call this method automatically.
     */
    static associate(models: any) {
        // console.log("came here");
        // define association here
        // course.hasMany(models, { foreignKey: "course_id", as: "courseModules" });
    }

    
}
user_ctopic_progress.init(
    {
      user_ctopic_progress_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        course_topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE')
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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
        tableName: 'user_ctopic_progresses'
    }
);

//TODO:call associate method is any association is defined
  
