import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../configs/constents.config';

const tableName = "teams_courses_mappings";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, {
		teams_courses_mappings_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'courses',
                key:'course_id'
            }
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'teams',
                key:'team_id'
            }
        }
	  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable(tableName);
};