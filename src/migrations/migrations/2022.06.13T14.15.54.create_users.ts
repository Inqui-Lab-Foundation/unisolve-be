import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../configs/constents.config';
// you can put some team-specific imports/code here to be included in every migration

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('users', {
		user_id: {
			allowNull: false,
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(55),
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			// select: false
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		date_of_birth: {
			type: DataTypes.DATE,
			allowNull: true
		},
		mobile: {
			type: DataTypes.STRING(50),
			unique: true,
			allowNull: false
		},
		team_id: {
			type: DataTypes.STRING,
		},
		org_name: {
			type: DataTypes.STRING,
		},
		qualification: {
			type: DataTypes.STRING,
			allowNull: false
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
		status: {
			type: DataTypes.ENUM(...Object.values(constents.common_status_flags.list)),
			defaultValue: constents.common_status_flags.default
		},
		role: {
			type: DataTypes.ENUM(...Object.values(constents.user_role_flags.list)),
			defaultValue: constents.user_role_flags.default
		},
		is_loggedin: {
			type: DataTypes.ENUM(...Object.values(constents.common_yes_no_flags.list)),
			defaultValue: constents.common_yes_no_flags.default
		},
		last_login: {
			type: DataTypes.DATE
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		updated_by: {
			type: DataTypes.INTEGER
		}
	  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('users');
};