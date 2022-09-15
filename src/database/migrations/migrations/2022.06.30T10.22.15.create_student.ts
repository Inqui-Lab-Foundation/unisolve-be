import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "students";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().createTable(tableName, {
		student_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'user_id'
			}
		},
		team_id: {
			type: DataTypes.STRING,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date_of_birth: {
			type: DataTypes.DATE,
			allowNull: true
		},
		institute_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		qualification: {
			type: DataTypes.STRING,
			allowNull: false
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
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().dropTable(tableName);
};