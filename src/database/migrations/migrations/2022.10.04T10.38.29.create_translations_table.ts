import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';
import { translation } from '../../../models/translation.model';

// you can put some table-specific imports/code here
export const tableName = translation.modelTableName;
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().createTable(tableName,translation.structrue);
};

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().dropTable(tableName);
};