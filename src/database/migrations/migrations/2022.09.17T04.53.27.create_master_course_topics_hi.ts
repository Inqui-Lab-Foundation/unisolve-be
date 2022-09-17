import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../../configs/constents.config';

const tableName = "master_course_topics_hi";
export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable(tableName, {
		course_topic_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		course_module_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "course_modules",
				key: "course_module_id"
			}
		},
		topic_type_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null
		},
		topic_type: {
			type: DataTypes.ENUM(...Object.values(constents.topic_type_flags.list)),
			allowNull: false,
			defaultValue: constents.topic_type_flags.default
		},
		title: {
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