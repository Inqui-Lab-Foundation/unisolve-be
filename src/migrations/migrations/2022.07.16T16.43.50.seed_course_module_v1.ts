import { Migration } from '../umzug';
import { DataTypes } from 'sequelize';
import { constents } from '../../configs/constents.config';
import { course } from '../../models/course.model';
import { course_module } from '../../models/course_module.model';
import { title } from 'process';
import { random } from 'lodash';

// you can put some table-specific imports/code here
export const tableName = "name_of_your_table";
export const up: Migration = async ({ context: sequelize }) => {
	// await sequelize.query(`raise fail('up migration not implemented')`); //call direct sql 
	//or below implementation 
	const courseInserted : any = await sequelize.getQueryInterface().insert(new course(),'courses',{
		title: 'UNISOLVE',
		description: 'nurturing a culture of creativity, design, and innovation among the educational community',
        created_by: 1,
		updated_by: 1,
	});
	
	//mod 1
	const cmInserted1 = await createCourseModule(sequelize,courseInserted[0].course_id,"INSPIRATION",
	"Welcome to the First step in your Problem Solving Journey.\n"+
	"Do you want to make a difference in the world around you but are not sure how?\n"+
	"Then watch the story of our Problem Solvers: Adila, Aryn, Shama and Amir.\n"+
	"What inspired them to be Problem Solvers? Let us see and get inspired too!")

	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Our Future")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Solver in us")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Innovation for better life")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"VIDEO","Sustainable Development Goals")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"QUIZ","Quiz 1")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted1,"WORKSHEET","WORKSHEET 1")
	

	//mod 2

	const cmInserted2 = await createCourseModule(sequelize,courseInserted[0].course_id,"ME AND US",
	"Congrulations on the start of your Journey. \n"+
	"Do you know what makes a great team? \n"+
	"Let's find out what Aryn's teacher has to say about it. ")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"VIDEO","Our Team")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"VIDEO","Your journey ahead")
	// await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"QUIZ","Quiz 2")//note :: if you comment this out then u will also have to fix the quiz id in quiz seeder 
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted2,"WORKSHEET","WORKSHEET 2")

	//mod 3

	const cmInserted3 = await createCourseModule(sequelize,courseInserted[0].course_id,"FEEL & FIND",
	"Phew! Just like Amir and his team, you too have a strong team of Problem Solvers.\n"+
	"But you know, Amir and his team are confused how to Find problems in their community. \n"+
	"I am sure you too must be wondering.\n"+
	"Farah and their teacher helped them out. But who is Farah?\n"+
	"Let's find out!  ")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"VIDEO","What are problems?")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"VIDEO","Identifying problems (with examples of tools)")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"QUIZ","Quiz 3")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted3,"WORKSHEET","WORKSHEET 3")
	
	//mod 4
	const cmInserted4 = await createCourseModule(sequelize,courseInserted[0].course_id,"Community Map")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"VIDEO","Choosing a problem")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"QUIZ","Quiz 4")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted4,"WORKSHEET","WORKSHEET 4")

	//mod 5
	const cmInserted5 = await createCourseModule(sequelize,courseInserted[0].course_id,"EXPLORE",
	"Are you ready with your choosen Problem?\n"+
	"Remember? Shama and team too have choosen a problem to solve.\n"+
	"But do they know enough about the probelm they identified?\n"+
	"Let us see how they Explored the problem deeper to understand it better!")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Stakeholder Map")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Mind-Map")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Understanding a problem")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"VIDEO","Developing  a problem statement")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"QUIZ","Quiz 5")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted5,"WORKSHEET","WORKSHEET 5")


	//mod 6
	const cmInserted6 = await createCourseModule(sequelize,courseInserted[0].course_id,"GIVE IDEAS",
	"Give yourself a pat on your back for completing more than half of the Problem Solving Journey.\n"+
	"You are a Star. The Journey ahead is full of Fun and Learnings.\n"+
	"Ideas! Ideas! Ideas!\n"+
	"Let's see how Aryn and team came up with them and learn from them how to Give Ideas!")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Thinking Critically and creatively")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Idea Generation")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Idea Generation")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Selecting a solution")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"VIDEO","Refining solution -peer and expert, user feedback")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"QUIZ","Quiz 6")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted6,"WORKSHEET","WORKSHEET 6")
	
	//mod 7
	const cmInserted7 = await createCourseModule(sequelize,courseInserted[0].course_id,"MAKE & TEST",
	"Now Comes the most exciting step in your Problem Solving Journey: Make your Idea Real.\n"+
	"Are you excited to see how Adila and team did that? \n"+
	"We are excited too, to tell you their story!\n"+
	"So, why wait? Let's watch and learn!");
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"VIDEO","Prototyping Methods")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"VIDEO","Buiding prototypes and Resourcing")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"VIDEO","Testing & refine")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"VIDEO","Finalising Solutions")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"QUIZ","Quiz 7")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted7,"WORKSHEET","WORKSHEET 7")


	
	// mod 8
	const cmInserted8 = await createCourseModule(sequelize,courseInserted[0].course_id,"CONCLUSION",
	"Once a Problem Solver, Always a Problem Solver!\n"+ 
	"A huge Hi-fi from us to the Problem Solver in you.\n"+
	"We have just one more thing to tell you. Please watch");
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted8,"VIDEO","Submitting an idea on the platform")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted8,"VIDEO","Problem solvers for life")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted8,"QUIZ","Quiz 8")
	await createCourseTopicAlongWithAssociations(sequelize,cmInserted8,"WORKSHEET","WORKSHEET 8")

	

};

let currentVideoCount = 0;
async function createCourseTopicAlongWithAssociations(sequelize:any,arg_course_module_id:number,arg_topic_type:string,arg_title:string,arg_attachments:string="https://google.com"){
	let idOfTypeInserted =null;
	const listofVideoIds = [
		"666422934",
		"666424082",
		"666424896",
		"666425860",
		"666426714",
		"666427284",
		"666428367",
		"666429408",
		"666429842",
		"674787248",
		"666427316",
		"666428034",
		"666428213",
		"666428771",
		"666429226",
		"666429792",
		"666430099",
		"666430460",
		"666430658",
		"666431426",
		"666431587",
		"666436469",
		"666436880",
		"666437136",
		"666437612",
		"666437976",
		"666438269"
	]
	if(arg_topic_type=='VIDEO'){
		idOfTypeInserted = await createCourseVideo(sequelize,listofVideoIds[currentVideoCount])
		currentVideoCount++;
	}else if(arg_topic_type=='WORKSHEET'){
		idOfTypeInserted = await createCourseWorksheet(sequelize,arg_title,arg_attachments)
	}else if (arg_topic_type=='QUIZ'){
		idOfTypeInserted =  await createQuiz(sequelize,4)
	}
	const idOfCourseTopicInserted = await createCourseTopic(sequelize,arg_course_module_id,idOfTypeInserted,arg_topic_type,arg_title)
	return idOfCourseTopicInserted;
}

async function createQuiz(sequelize:any,no_of_questions:number){
	const courseQzInsterted = await sequelize.getQueryInterface().bulkInsert('quiz',[
		{
			no_of_questions:no_of_questions,
			created_by: 1,
			updated_by: 1,
		}
	]);

	return courseQzInsterted

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
			video_duration: 240,
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

async function createCourseModule(sequelize:any,course_id:number,title:string,desc:any=null){
	const courseModulesInsterted = await sequelize.getQueryInterface().bulkInsert('course_modules',[
		{
			title: title,
			description:desc,
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