import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../configs/constents.config';
import { course } from '../../models/course.model';
import { course_module } from '../../models/course_module.model';
import { title } from 'process';

// you can put some table-specific imports/code here
export const tableName = "name_of_your_table";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	const courseInserted : any = await sequelize.getQueryInterface().insert(new course(),'courses',{
		title: 'Unisolve',
        created_by: 1,
		updated_by: 1,
	});
	
	//mod 1
	const cmInserted1 = await createCourseModule(sequelize,courseInserted[0].course_id,"Inspiration")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Video 1")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Video 2")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Video 3")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Video 4")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"WORKSHEET","WORKSHEET 1")

	//mod 2

	const cmInserted2 = await createCourseModule(sequelize,courseInserted[0].course_id,"Me & us")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"VIDEO","Video 5")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"VIDEO","Video 6")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"WORKSHEET","WORKSHEET 2")

	//mod 3

	const cmInserted3 = await createCourseModule(sequelize,courseInserted[0].course_id,"Feel and Find")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"VIDEO","Video 7")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"VIDEO","Video 8")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"VIDEO","Video 9")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"VIDEO","Video 10")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"WORKSHEET","WORKSHEET 3")
	
	//mod 4
	const cmInserted4 = await createCourseModule(sequelize,courseInserted[0].course_id,"Explore")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"VIDEO","Video 11")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"VIDEO","Video 12")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"VIDEO","Video 13")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"VIDEO","Video 14")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"WORKSHEET","WORKSHEET 4")


	//mod 5
	const cmInserted5 = await createCourseModule(sequelize,courseInserted[0].course_id,"Give Ideas")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Video 15")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Video 16")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Video 17")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Video 18")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Video 19")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"WORKSHEET","WORKSHEET 5")
	
	//mod 6
	const cmInserted6 = await createCourseModule(sequelize,courseInserted[0].course_id,"Make & Test")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Video 20")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Video 21")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Video 22")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Video 23")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Video 24")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"WORKSHEET","WORKSHEET 6")


	// mod 7
	const cmInserted7 = await createCourseModule(sequelize,courseInserted[0].course_id,"Conclusion");
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"VIDEO","Video 25")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"VIDEO","Video 26")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"WORKSHEET","WORKSHEET 7")

	

};

async function createCourseTopicAlongWithAssociations(sequelize:any,arg_course_module_id:number,arg_topic_type:string,arg_title:string,arg_attachments:string="https://google.com"){
	let idOfTypeInserted =null;
	if(arg_topic_type=='VIDEO'){
		idOfTypeInserted = await createCourseVideo(sequelize,arg_title.split(" ")[1])
	}else if(arg_topic_type=='WORKSHEET'){
		idOfTypeInserted = await createCourseWorksheet(sequelize,arg_title,arg_attachments)
	}

	const idOfCourseTopicInserted = await createCourseTopic(sequelize,arg_course_module_id,idOfTypeInserted,arg_topic_type,arg_title)
	return idOfCourseTopicInserted;

}


async function createCourseWorksheet(sequelize:any,arg_title:string,arg_attachments:string){
	const courseWsInsterted = await sequelize.getQueryInterface().bulkInsert('worksheets',[
		{
			
			attachments:arg_attachments,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseWsInsterted
}

async function createCourseVideo(sequelize:any,arg_video_stream_id:string){
	const courseVideoInsterted = await sequelize.getQueryInterface().bulkInsert('videos',[
		{
			video_stream_id: arg_video_stream_id,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseVideoInsterted
}

async function createCourseTopic(sequelize:any,arg_course_module_id:number,arg_topic_type_id:number,arg_topic_type:string,arg_title:string){
	const courseTopicInsterted = await sequelize.getQueryInterface().bulkInsert('course_topics',[
		{
			title: arg_title,
			created_by: 1,
			updated_by: 1,
			course_module_id:arg_course_module_id,
			topic_type_id:arg_topic_type_id,
			topic_type:arg_topic_type
		}
	]);

	return courseTopicInsterted
}

async function createCourseModule(sequelize:any,course_id:number,title:string){
	const courseModulesInsterted = await sequelize.getQueryInterface().bulkInsert('course_modules',[
		{
			title: title,
			created_by: 1,
			updated_by: 1,
			course_id:course_id
		}
	]);

	return courseModulesInsterted
}

export const down: Migration = async ({ context: sequelize }) => {
	// 	await sequelize.query(`raise fail('down migration not implemented')`); //call direct sql 
	//or below implementation 
	await sequelize.getQueryInterface().dropTable(tableName);
};