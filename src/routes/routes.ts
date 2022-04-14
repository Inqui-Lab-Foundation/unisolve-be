/*Importing the dependencies*/
import { Express, Request, Response } from 'express';

import videoControllers from '../controllers/video.controllers';
import evaluatorControllers from '../controllers/evaluator.controllers';
import mentorControllers from '../controllers/mentor.controllers';
import studentControllers from '../controllers/auth.controllers';

import requiredUser from '../middleware/requiredlogin';
import validate from '../middleware/validateResource';

import { videoPayload, videoUpdate } from '../schemas/video.schema';
import { evaluatorPayload, evaluatorUpdate } from '../schemas/evaluator.schema';
import { mentorPayload, mentorUpdate } from '../schemas/mentor.schema';
import { userPasswordSchema, userLoginSchema, userRegisterSchema } from '../schemas/student.schema';
import { coursePayload, courseUpdate } from '../schemas/course.schema';
import courseControllers from '../controllers/course.controllers';
import moduleControllers from '../controllers/module.controllers';

/**
 * API's handler functions 
 * @param App Express.
 * @called from single src server.ts
 */
function routes(App: Express) {

    //student 
    App.post('/api/v1/student/changePassword', requiredUser, validate(userPasswordSchema), studentControllers.changePasswordHandler)

    //videos
    App.post('/api/v1/video/create', validate(videoPayload), requiredUser, videoControllers.createHandler);
    App.get('/api/v1/video/list', requiredUser, videoControllers.getHandler);
    App.get('/api/v1/video/get/:videoId', requiredUser, videoControllers.getByIdHandler);
    App.put('/api/v1/video/update/:videoId', validate(videoUpdate), requiredUser, videoControllers.updateHandler);
    App.delete('/api/v1/video/delete/:videoId', requiredUser, videoControllers.deleteHandler);

    //course
    App.post('/api/v1/course/create', validate(coursePayload), requiredUser, courseControllers.createHandler);
    App.get('/api/v1/course/list', requiredUser, courseControllers.getHandler);
    App.get('/api/v1/course/get/:courseId', requiredUser, courseControllers.getByIdHandler);
    App.put('/api/v1/course/update/:courseId', validate(courseUpdate), requiredUser, courseControllers.updateHandler);
    App.delete('/api/v1/course/delete/:courseId', requiredUser, courseControllers.deleteHandler);

    //modules
    App.post('/api/v1/modules/create', requiredUser, moduleControllers.createHandler);
    App.get('/api/v1/modules/list', requiredUser, moduleControllers.getHandler);
    App.get('/api/v1/modules/get/:moduleId', requiredUser, moduleControllers.getByIdHandler);
    App.put('/api/v1/modules/update/:moduleId', requiredUser, moduleControllers.updateHandler);
    App.delete('/api/v1/modules/delete/:moduleId', requiredUser, moduleControllers.deleteHandler);

    //mentor
    App.post('/api/v1/mentor/create', validate(mentorPayload), requiredUser, mentorControllers.createHandler);
    App.get('/api/v1/mentor/list', requiredUser, mentorControllers.getHandler);
    App.get('/api/v1/mentor/get/:mentorId', requiredUser, mentorControllers.getByIdHandler);
    App.put('/api/v1/mentor/update/:mentorId', validate(mentorUpdate), requiredUser, mentorControllers.updateHandler);
    App.delete('/api/v1/mentor/delete/:mentorId', requiredUser, mentorControllers.deleteHandler)

    //evaluator
    App.post('/api/v1/evaluator/create', validate(evaluatorPayload), requiredUser, evaluatorControllers.createHandler);
    App.get('/api/v1/evaluator/list', requiredUser, evaluatorControllers.getHandler);
    App.get('/api/v1/evaluator/get/:evaluatorId', requiredUser, evaluatorControllers.getByIdHandler);
    App.put('/api/v1/evaluator/update/:evaluatorId', validate(evaluatorUpdate), requiredUser, evaluatorControllers.updateHandler);
    App.delete('/api/v1/evaluator/delete/:evaluatorId', requiredUser, evaluatorControllers.deleteHandler)
}
export default routes;