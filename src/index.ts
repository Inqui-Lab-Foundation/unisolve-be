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
        new TeamController
    ], Number(process.env.APP_PORT));
    // starting app
    app.listen();
} catch (error) {
    console.log(error);
}