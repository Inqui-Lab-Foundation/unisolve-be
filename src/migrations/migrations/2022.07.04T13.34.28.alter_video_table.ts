import { Migration } from '../umzug';
import { DataTypes, Sequelize } from 'sequelize';
import { constents } from '../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "videos";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().addColumn(
		tableName,
		'video_duration',
		{ type: DataTypes.STRING, allowNull: false, defaultValue: '-1' });
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().removeColumn(tableName, 'video_duration');
};	