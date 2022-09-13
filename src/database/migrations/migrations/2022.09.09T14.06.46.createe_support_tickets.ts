import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "support_tickets";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, {
			support_ticket_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			query_category: {
				type: DataTypes.STRING,
				allowNull: false
			},
			query_details: {
				type: DataTypes.TEXT("long"),
				allowNull: false
			},
			status: {
				type: DataTypes.ENUM(...Object.values(constents.support_tickets_status_flags.list)),
				defaultValue: constents.support_tickets_status_flags.default
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