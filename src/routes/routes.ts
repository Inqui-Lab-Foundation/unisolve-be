/*Importing the dependencies*/
import { Express } from 'express';

import videoControllers from '../controllers/video.controllers';
import evaluatorControllers from '../controllers/evaluator.controllers';
import mentorControllers from '../controllers/mentor.controllers';

import validate from '../middleware/validateResource';

import { videoPayload, videoUpdate } from '../payloadSchema/video.schema';
import { evaluatorPayload, evaluatorUpdate } from '../payloadSchema/evaluator.schema';
import { mentorPayload, mentorUpdate } from '../payloadSchema/mentor.schema';
import { studentPasswordSchema } from '../payloadSchema/payloadShcemas';
import { coursePayload, courseUpdate } from '../payloadSchema/course.schema';
import courseControllers from '../controllers/course.controllers';
import moduleControllers from '../controllers/module.controllers';

/**
 * API's handler functions 
 * @param App Express.
 * @called from single src server.ts
 */
function routes(App: Express) {

    //videos
    App.post('/api/v1/video/create', validate(videoPayload), videoControllers.createHandler);
    App.get('/api/v1/video/list', videoControllers.getHandler);
    App.get('/api/v1/video/get/:videoId', videoControllers.getByIdHandler);
    App.put('/api/v1/video/update/:videoId', validate(videoUpdate), videoControllers.updateHandler);
    App.delete('/api/v1/video/delete/:videoId', videoControllers.deleteHandler);

    //course
    App.post('/api/v1/course/create', validate(coursePayload), courseControllers.createHandler);
    App.get('/api/v1/course/list', courseControllers.getHandler);
    App.get('/api/v1/course/get/:courseId', courseControllers.getByIdHandler);
    App.put('/api/v1/course/update/:courseId', validate(courseUpdate), courseControllers.updateHandler);
    App.delete('/api/v1/course/delete/:courseId', courseControllers.deleteHandler);

    //modules
    App.post('/api/v1/modules/create', moduleControllers.createHandler);
    App.get('/api/v1/modules/list', moduleControllers.getHandler);
    App.get('/api/v1/modules/get/:moduleId', moduleControllers.getByIdHandler);
    App.put('/api/v1/modules/update/:moduleId', moduleControllers.updateHandler);
    App.delete('/api/v1/modules/delete/:moduleId', moduleControllers.deleteHandler);

    //mentor
    App.post('/api/v1/mentor/create', validate(mentorPayload), mentorControllers.createHandler);
    App.get('/api/v1/mentor/list', mentorControllers.getHandler);
    App.get('/api/v1/mentor/get/:mentorId', mentorControllers.getByIdHandler);
    App.put('/api/v1/mentor/update/:mentorId', validate(mentorUpdate), mentorControllers.updateHandler);
    App.delete('/api/v1/mentor/delete/:mentorId', mentorControllers.deleteHandler)

    //evaluator
    App.post('/api/v1/evaluator/create', validate(evaluatorPayload), evaluatorControllers.createHandler);
    App.get('/api/v1/evaluator/list', evaluatorControllers.getHandler);
    App.get('/api/v1/evaluator/get/:evaluatorId', evaluatorControllers.getByIdHandler);
    App.put('/api/v1/evaluator/update/:evaluatorId', validate(evaluatorUpdate), evaluatorControllers.updateHandler);
    App.delete('/api/v1/evaluator/delete/:evaluatorId', evaluatorControllers.deleteHandler)
}
export default routes;