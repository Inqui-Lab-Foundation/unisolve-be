import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';

// you can put some team-specific imports/code here to be included in every migration

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('courses', {
		course_id: {
		  allowNull: false,
		  autoIncrement: true,
		  primaryKey: true,
		  type: DataTypes.INTEGER
		},
		title: {
		  allowNull: false,
		  type: DataTypes.STRING
		},
		description: {
		  type: DataTypes.STRING
		},
		status: {
		  type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'DELETD')
		},
		thumbnail: {
		  type: DataTypes.STRING
		},
		created_at: {
		  allowNull: false,
		  type: DataTypes.DATE
		},
		updated_at: {
		  allowNull: false,
		  type: DataTypes.DATE
		}
	  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('courses');
};