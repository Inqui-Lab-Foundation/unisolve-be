import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "dashboardMapStats";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().createTable(tableName, {
		dashboardMapStats_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		district_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		overall_schools: {
			type: DataTypes.STRING,
			allowNull: false
		},
		reg_schools: {
			type: DataTypes.STRING,
			allowNull: false
		},
		teams: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ideas: {
			type: DataTypes.STRING,
			allowNull: false
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
	});
};

export const down: Migration = async ({ context: sequelize }) => { 
	await sequelize.getQueryInterface().dropTable(tableName);
};