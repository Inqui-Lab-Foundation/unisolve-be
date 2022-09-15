import "dotenv/config";
import validateEnv from "./utils/validate_env";
import App from "./app";

import AuthController from "./controllers/auth.controller";
// import CRUDController from "./controllers/crud.controller"; // (Disabling CRUD API's for directly use)
import NotificationsController from "./controllers/notifications.controller";
import CourseController from "./controllers/course.controller";
import VideoController from "./controllers/video.controller";
import TeamController from "./controllers/team.controller";
import CourseModulesController from "./controllers/courseModule.controller";
import CourseTopicController from "./controllers/courseTopic.controller";
import WorksheetController from "./controllers/worksheet.controller";
import UserTopicProgress from "./controllers/userTopicProgress.controller";
import QuizController from "./controllers/quiz.controller";
import FaqCategoryController from "./controllers/faq_category.controller";
import FaqController from "./controllers/faq.controller";

import OrganizationController from "./controllers/organization.controller";
import ReflectiveQuizController from "./controllers/reflective_quiz.controller";
import MentorController from "./controllers/mentor.controller";
import StudentController from "./controllers/student.controller";
import AdminController from "./controllers/admin.controller";
import EvaluaterController from "./controllers/evulator.controller";
import QuizSurveyController from "./controllers/quiz_survey.controller";
import MentorCourseController from "./controllers/mentorCourse.controller";
import MentorAttachmentController from "./controllers/mentorAttachment.controller";
import MentorTopicProgressController from "./controllers/mentorTopicProgress.controller";
import SupportTicketController from "./controllers/supportTickets.controller";
import SupportTicketRepliesController from "./controllers/supportTicketsReplies.controller";
import QuizQuestionsController from "./controllers/quiz_questions.controller";

// validating env variables
validateEnv();

// initializing app
try {
    const app = new App([
        // new CRUDController (Disabling CRUD API's for directly use)
        new AuthController,
        new NotificationsController,
        new CourseController,
        new CourseModulesController,
        new VideoController,
        new TeamController,
        new CourseTopicController,
        new WorksheetController,
        new UserTopicProgress,
        new QuizController,
        new FaqCategoryController,
        new FaqController,
        new OrganizationController,
        new ReflectiveQuizController,
        new MentorController,
        new AdminController,
        new StudentController,
        new EvaluaterController,
        new QuizSurveyController,
        new MentorCourseController,
        new MentorAttachmentController,
        new MentorTopicProgressController,
        new SupportTicketController,
        new SupportTicketRepliesController,
        new QuizQuestionsController
    ], Number(process.env.APP_PORT));
    // starting app
    app.listen();
} catch (error) {
    console.log(error);
}