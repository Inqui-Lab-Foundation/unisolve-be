/*Importing the dependencies*/
import { Express, Request, Response } from 'express';

import courseControllers from './controllers/course.controllers';
import evaluatorControllers from './controllers/evaluator.controllers';
import mentorControllers from './controllers/mentor.controllers';
import studentControllers from './controllers/student.controllers';

import requiredUser from './middleware/student/requiredlogin';
import validate from './middleware/validateResource';

import { courserPayload, courseUpdate } from './schemas/course.schema';
import { evaluatorPayload, evaluatorUpdate } from './schemas/evaluator.schema';
import { mentorPayload, mentorUpdate } from './schemas/mentor.schema';
import { userPasswordSchema, userLoginSchema, userLogout, userRegisterSchema } from './schemas/student.schema';

/**
 * API's handler functions 
 * @param App Express.
 * @called from single src server.ts
 */
function routes(App: Express) {

    //health checking api
    App.get('/api/v1/healthCheck', (req: Request, res: Response) => { res.sendStatus(200) });

    //authentication
    App.post('/api/v1/student/register', validate(userRegisterSchema), studentControllers.registerHandler);
    App.post('/api/v1/student/login', validate(userLoginSchema), studentControllers.loginHandler);
    App.post('/api/v1/student/changePassword', validate(userPasswordSchema), studentControllers.changePasswordHandler)
    App.get('/api/v1/student/logout', validate(userLogout), requiredUser, studentControllers.logoutHandler);

    //courses
    App.post('/api/v1/course/create', validate(courserPayload), requiredUser, courseControllers.createCourse);
    App.get('/api/v1/course/list', requiredUser, courseControllers.getCourse);
    App.get('/api/v1/course/:courseId', requiredUser, courseControllers.getCourseById);
    App.put('/api/v1/course/:courseId', validate(courseUpdate), requiredUser, courseControllers.updateCourse);
    App.delete('/api/v1/course/:courseId', requiredUser, courseControllers.deleteCourse);

    //mentor
    App.post('/api/v1/mentor/create', validate(mentorPayload), requiredUser, mentorControllers.createMentor);
    App.get('/api/v1/mentor/list', requiredUser, mentorControllers.getMentor);
    App.get('/api/v1/mentor/:mentorId', requiredUser, mentorControllers.getMentorById);
    App.put('/api/v1/mentor/:mentorId', validate(mentorUpdate), requiredUser, mentorControllers.updateMentor);
    App.delete('/api/v1/mentor/:mentorId', requiredUser, mentorControllers.deleteMentor)

    //evaluator
    App.post('/api/v1/evaluator/create', validate(evaluatorPayload), requiredUser, evaluatorControllers.createEvaluator);
    App.get('/api/v1/evaluator/list', requiredUser, evaluatorControllers.getEvaluator);
    App.get('/api/v1/evaluator/:evaluatorId', requiredUser, evaluatorControllers.getEvaluatorById);
    App.put('/api/v1/evaluator/:evaluatorId', validate(evaluatorUpdate), requiredUser, evaluatorControllers.updateEvaluator);
    App.delete('/api/v1/evaluator/:evaluatorId', requiredUser, evaluatorControllers.deleteEvaluator)
}
export default routes;


//Swagger Documentation
/**
    * @openapi
    * '/api/v1/healthCheck':
    *  get:
    *     tags:
    *     - Health Checker
    *     description: Responds if the app is up and running
    *     parameters:
    *       Null
    *     responses:
    *       200:
    *         description: App is up and running
    */

/**
    * Student API Documentation 
    * @openapi
    * '/api/v1/student/register':
    *  post:
    *     tags:
    *     - Student
    *     summary: Register a student
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/userRegisterInput'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/userRegisterResponse'
    *       409:
    *         description: Conflict
    *       400:
    *         description: Bad request
    */

/**
    * @openapi
    * '/api/v1/student/login':
    *  post:
    *     tags:
    *     - Student
    *     summary: Login a student
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/userLoginInput'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/userLoginResponse'
    *       401:
    *         description: Unauthorized
    *       409:
    *         description: Conflict
    *       400:
    *         description: Bad Request
    */

/**
    * @openapi
    * '/api/v1/student/changePassword':
    *  post:
    *     tags:
    *     - Student
    *     summary: Change password of a  student
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/userChangePassword'
    *     responses:
    *       202:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/userChangePasswordResponse'
    *       401:
    *         description: Unauthorized
    *       405:
    *         description: Method Not Allowed
    *       400:
    *         description: Bad Request
    */

/**
    * @openapi
    * '/api/v1/student/logout':
    *  get:
    *     tags:
    *     - Student
    *     summary: logout student
    *     responses:
    *       202:
    *         description: Success
    *       401:
    *         description: Unauthorized
    *       405:
    *         description: Method Not Allowed
    *       400:
    *         description: Bad Request
    */

/**
    * Course API Documentation  
    * @openapi
    * '/api/v1/course/create':
    *  post:
    *     tags:
    *     - Course
    *     summary: Create a course entry
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/createCoursePayload'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/createCourseResponse'
    *       409:
    *         description: Conflict
    *       400:
    *         description: Bad request
    */
/**
 * @openapi
 * '/api/v1/course/courseList':
 *  get:
 *     tags:
 *     - Course
 *     summary: Get the list of the course
 *     responses:
 *       202:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method Not Allowed
 *       400:
 *         description: Bad Request
 */
/**
 * @openapi
 * '/api/v1/course/{course_id}':
 *  get:
 *     tags:
 *     - Course
 *     summary: Get the single course
 *     responses:
 *       202:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method Not Allowed
 *       400:
 *         description: Bad Request
 */
/**
    * @openapi
    * '/api/v1/course/update/{course_id}':
    *  put:
    *     tags:
    *     - Course
    *     summary: Create a course entry
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/courseUpdatePayload'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/courseUpdateRepose'
    *       409:
    *         description: Conflict
    *       400:
    *         description: Bad request
    */
/**
* @openapi
* '/api/v1/course/delete/{course_id}':
*  delete:
*     tags:
*     - Course
*     summary: delete the single entry with course id
*     responses:
*       202:
*         description: Success
*       401:
*         description: Unauthorized
*       405:
*         description: Method Not Allowed
*       400:
*         description: Bad Request
*/

/**
    * Mentor API Documentation  
    * @openapi
    * '/api/v1/mentor/create':
    *  post:
    *     tags:
    *     - Mentor
    *     summary: Create a Mentor entry
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/createMentorPayload'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/createMentorResponse'
    *       409:
    *         description: Conflict
    *       400:
    *         description: Bad request
    */
/**
 * @openapi
 * '/api/v1/mentor/mentorList':
 *  get:
 *     tags:
 *     - Mentor
 *     summary: Get the list of the mentors
 *     responses:
 *       202:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method Not Allowed
 *       400:
 *         description: Bad Request
 */
/**
 * @openapi
 * '/api/v1/mentor/{mentorId}':
 *  get:
 *     tags:
 *     - Mentor
 *     summary: Get the single mentor with Id
 *     responses:
 *       202:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method Not Allowed
 *       400:
 *         description: Bad Request
 */
/**
    * @openapi
    * '/api/v1/mentor/update/{mentorId}':
    *  put:
    *     tags:
    *     - Mentor
    *     summary: update the correction to the registered mentor
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/mentorUpdatePayload'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *                ref: '#/components/schemas/mentorUpdateRepose'
    *       409:
    *         description: Conflict
    *       400:
    *         description: Bad request
    */
/**
* @openapi
* '/api/v1/mentor/delete/{mentorId}':
*  delete:
*     tags:
*     - Mentor
*     summary: remove the entry from the database
*     responses:
*       202:
*         description: Success
*       401:
*         description: Unauthorized
*       405:
*         description: Method Not Allowed
*       400:
*         description: Bad Request
*/

/**
    * Evaluator API Documentation
    * @openapi
    * '/api/v1/evaluator/create':
    *  post:
    *     tags:
    *     - Evaluator
    *     summary: Create a evaluator entry
    *     requestBody:
    *      required: true
    *      content: 
    *        application/json:
    *           schema: 
    *              $ref: '#/components/schemas/createEvaluatorPayload'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema: 
    *                ref: '#/components/schemas/createEvaluatorResponse'
    *       409:
    *         description: Conflict 
    *       400:
    *         description: Bad request
    */
/**
 * @openapi
 * '/api/v1/evaluator/evaluatorList':
 *  get:
 *     tags:
 *     - Evaluator
 *     summary: Get the list of the evaluators
 *     responses:
 *       202:
 *         description: Success
 *       401:
 *         description: Unauthorized 
 *       405:
 *         description: Method Not Allowed
 *       400:
 *         description: Bad Request
 */
/**
 * @openapi
 * '/api/v1/evaluator/{evaluatorId}':
 *  get:
 *     tags:
 *     - Evaluator
 *     summary: Get the single evaluator with Id
 *     responses:
 *       202:
 *         description: Success
 *       401:
 *         description: Unauthorized 
 *       405:
 *         description: Method Not Allowed
 *       400:
 *         description: Bad Request
 */
/**
    * @openapi
    * '/api/v1/evaluator/update/{evaluatorId}':
    *  put:
    *     tags:
    *     - Evaluator
    *     summary: update the correction to the registered evaluator
    *     requestBody:
    *      required: true
    *      content: 
    *        application/json:
    *           schema: 
    *              $ref: '#/components/schemas/evaluatorUpdatePayload'
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema: 
    *                ref: '#/components/schemas/evaluatorUpdateRepose'
    *       409:
    *         description: Conflict 
    *       400:
    *         description: Bad request
    */
/**
* @openapi
* '/api/v1/evaluator/delete/{evaluatorId}':
*  delete:
*     tags:
*     - Evaluator
*     summary: remove the entry from the database
*     responses:
*       202:
*         description: Success
*       401:
*         description: Unauthorized 
*       405:
*         description: Method Not Allowed
*       400:
*         description: Bad Request
*/