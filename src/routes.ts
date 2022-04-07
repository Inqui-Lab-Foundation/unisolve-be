/*Importing the dependencies*/
import e, { Express, Request, Response } from 'express';

import courseControllers from './controllers/course.controllers';
import evaluatorControllers from './controllers/evaluator.controllers';
import mentorControllers from './controllers/mentor.controllers';
import studentControllers from './controllers/student.controllers';

import requiredUser from './middleware/student/requiredlogin';
import validate from './middleware/validateResource';

import { courserPayload, courseUpdate } from './schemas/course.schema';
import { evaluatorPayload, evaluatorUpdate } from './schemas/evaluator.schema';
import { mentorPayload, mentorUpdate } from './schemas/mentor.schema';
import { userPasswordSchema, userLoginSchema, userRegisterSchema } from './schemas/student.schema';

/**
 * API's handler functions 
 * @param App Express.
 * @called from single src server.ts
 */
function routes(App: Express) {

    //health checking api
    App.get('/api/v1/healthCheck', (req: Request, res: Response) => {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        try {
            res.send(healthcheck);
        } catch (error: any) {
            healthcheck.message = error;
            res.status(503).send(error);
        }
    });

    //authentication
    App.post('/api/v1/student/register', validate(userRegisterSchema), studentControllers.registerHandler);
    App.post('/api/v1/student/login', studentControllers.loginHandler);
    App.post('/api/v1/student/changePassword',requiredUser, validate(userPasswordSchema), studentControllers.changePasswordHandler)
    App.get('/api/v1/student/logout', requiredUser, studentControllers.logoutHandler);

    //courses
    App.post('/api/v1/course/create', validate(courserPayload), requiredUser, courseControllers.createCourse);
    App.get('/api/v1/course/list', requiredUser, courseControllers.getCourse);
    App.get('/api/v1/course/get/:courseId', requiredUser, courseControllers.getCourseById);
    App.put('/api/v1/course/update/:courseId', validate(courseUpdate), requiredUser, courseControllers.updateCourse);
    App.delete('/api/v1/course/delete/:courseId', requiredUser, courseControllers.deleteCourse);

    //mentor
    App.post('/api/v1/mentor/create', validate(mentorPayload), requiredUser, mentorControllers.createMentor);
    App.get('/api/v1/mentor/list', requiredUser, mentorControllers.getMentor);
    App.get('/api/v1/mentor/get/:mentorId', requiredUser, mentorControllers.getMentorById);
    App.put('/api/v1/mentor/update/:mentorId', validate(mentorUpdate), requiredUser, mentorControllers.updateMentor);
    App.delete('/api/v1/mentor/delete/:mentorId', requiredUser, mentorControllers.deleteMentor)

    //evaluator
    App.post('/api/v1/evaluator/create', validate(evaluatorPayload), requiredUser, evaluatorControllers.createEvaluator);
    App.get('/api/v1/evaluator/list', requiredUser, evaluatorControllers.getEvaluator);
    App.get('/api/v1/evaluator/get/:evaluatorId', requiredUser, evaluatorControllers.getEvaluatorById);
    App.put('/api/v1/evaluator/update/:evaluatorId', validate(evaluatorUpdate), requiredUser, evaluatorControllers.updateEvaluator);
    App.delete('/api/v1/evaluator/delete/:evaluatorId', requiredUser, evaluatorControllers.deleteEvaluator)
}
export default routes;