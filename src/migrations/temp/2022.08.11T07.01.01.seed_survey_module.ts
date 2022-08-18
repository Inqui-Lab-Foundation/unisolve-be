// import { Migration } from '../umzug';
// import { DataTypes } from 'sequelize';
// import { constents } from '../../configs/constents.config';
// import { Op } from 'sequelize';
//
// // you can put some table-specific imports/code here
// export const tableName = "name_of_your_table";
// export const up: Migration = async ({ context: sequelize }) => {
// 	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql
// 	//or below implementation
// 	await sequelize.getQueryInterface().createTable(tableName, {
// 		teams_courses_mappings_id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
// 	  });
// };
//
//
// async function createSurveyQuiz(
// 	sequelize:any,
// 	arg_name:string){
// 		const faqCatInsterted = await sequelize.getQueryInterface().bulkInsert('quiz_surveys',[
// 			{
// 				no_of_questions:5,
// 				name:"Pre Survey",
// 				role:"TEACHER",
// 				created_by: 1,
// 				updated_by: 1,
// 			}
// 		]);
//
// 		return faqCatInsterted
// }
//
// async function deleteSurveyQuiz(
// 	sequelize:any,
// 	arg_name:string){
// 		const faqCatDeleted = await sequelize.getQueryInterface().bulkDelete('faq_categories',{
// 			[Op.and]:[
// 				{category_name:arg_name},
// 				{created_by: 1},
// 				{updated_by: 1},
// 			]
// 		});
//
// 		return faqCatDeleted
//
// }
//
//
// export const down: Migration = async ({ context: sequelize }) => {
// 	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql
// 	//or below implementation
// 	await sequelize.getQueryInterface().dropTable(tableName);
// };