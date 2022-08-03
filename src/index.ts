import "dotenv/config";
import validateEnv from "./utils/validate_env";
import App from "./app";

import AuthController from "./controllers/auth.controller";
import CRUDController from "./controllers/crud.controller";
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

// validating env variables
validateEnv();

// initializing app
try {
    const app = new App([
        new AuthController,
        new CRUDController,
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
        new EvaluaterController
    ], Number(process.env.APP_PORT));
    // starting app
    app.listen();
} catch (error) {
    console.log(error);
}