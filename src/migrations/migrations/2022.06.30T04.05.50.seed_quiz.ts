import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../configs/constents.config';

// you can put some table-specific imports/code here
export const tableName = "name_of_your_table";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	await createQuizQuestion(sequelize,
		1,1,"q1","o1","o2","o3","o4","o3",1,"HARD")
	await createQuizQuestion(sequelize,
		1,1,"q2","o1","o2","o3","o4","o3",1,"MEDIUM")
	await createQuizQuestion(sequelize,
		1,1,"q3","o1","o2","o3","o4","o3",1,"EASY")
	
	await createQuizQuestion(sequelize,
		1,2,"q4","o1","o2","o3","o4","o3",2,"HARD")
	await createQuizQuestion(sequelize,
		1,2,"q5","o1","o2","o3","o4","o3",2,"MEDIUM")
	await createQuizQuestion(sequelize,
		1,2,"q6","o1","o2","o3","o4","o3",2,"EASY")


	await createQuizQuestion(sequelize,
		1,3,"q7","o1","o2","o3","o4","o3",3,"HARD")
	await createQuizQuestion(sequelize,
		1,3,"q8","o1","o2","o3","o4","o3",3,"MEDIUM")
	await createQuizQuestion(sequelize,
		1,3,"q9","o1","o2","o3","o4","o3",3,"EASY")

	await createQuizQuestion(sequelize,
		1,4,"q10","o1","o2","o3","o4","o3",4,"HARD")
	await createQuizQuestion(sequelize,
		1,4,"q11","o1","o2","o3","o4","o3",4,"MEDIUM")
	await createQuizQuestion(sequelize,
		1,4,"q12","o1","o2","o3","o4","o3",4,"EASY")
	
};

async function createQuizQuestion(
	sequelize:any,
	arg_quiz_id:number,
	arg_question_no:number,
	arg_q_txt:string,arg_o_txt1:string,arg_o_txt2:string,arg_o_txt3:string,arg_o_txt4:string,arg_correct_ans:string,arg_redirect_to:number,arg_level:string){
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert('quiz_questions',[
		{
			quiz_id:arg_quiz_id,
			question_no:arg_question_no,
			question:arg_q_txt,
			option_a:arg_o_txt1,
			option_b:arg_o_txt2,
			option_c:arg_o_txt3,
			option_d:arg_o_txt4,
			correct_ans:arg_correct_ans,
			redirect_to:arg_redirect_to,
			level:arg_level,
			msg_ans_correct:"keep up the good work.",
			msg_ans_wrong:"Opps may be you need to watch video again.",
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted

}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().dropTable(tableName);
};