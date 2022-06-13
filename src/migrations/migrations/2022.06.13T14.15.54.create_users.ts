import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';

// you can put some team-specific imports/code here to be included in every migration

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('users', {
		user_id: {
		  allowNull: false,
		  autoIncrement: true,
		  primaryKey: true,
		  type: DataTypes.INTEGER
		},
		email: {
		  allowNull: false,
		  unique: true,
		  type: DataTypes.STRING(55),
		  
		},
		password: {
		  allowNull: false,
		  type: DataTypes.STRING
		},
		full_name: {
		  type: DataTypes.STRING
		},
		image: {
		  type: DataTypes.STRING
		},
		date_of_birth: {
		  type: DataTypes.DATE
		},
		mobile: {
		  unique: true,
		  allowNull: false,
		  type: DataTypes.STRING(50)
		},
		team_id: {
		  allowNull:true,
		  type: DataTypes.INTEGER
		},
		org_name: {
		  type: DataTypes.STRING
		},
		qualification: {
		  type: DataTypes.STRING
		},
		stream: {
		  type: DataTypes.STRING
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
		role: {
		  type: DataTypes.ENUM('ADMIN', 'STUDENT', 'MENTOR','EVALUATER'),
		  defaultValue: 'ADMIN'
		},
		is_loggedin: {
		  type: DataTypes.ENUM('YES', 'NO'),
		  defaultValue: 'NO'
		},
		last_login: {
		  type: DataTypes.DATE
		},
		status: {
		  type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'LOCKED','DELETED'),
		  defaultValue: 'ACTIVE'
		},
		created_by: {
		  type: DataTypes.INTEGER
		},
		updated_by: {
		  type: DataTypes.INTEGER
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
	await sequelize.getQueryInterface().dropTable('users');
};