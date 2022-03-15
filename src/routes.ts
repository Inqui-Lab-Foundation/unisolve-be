/*Importing the dependencies*/
import { Express, Request, Response } from 'express';

import courseControllers from './controllers/course.controllers';
import evaluatorControllers from './controllers/evaluator.controllers';
import mentorControllers from './controllers/mentor.controllers';
import studentControllers from './controllers/student.controllers';
import requiredUser from './middleware/student/requiredLogin';

import validate from './middleware/validateResource';
import { courserPayload } from './schemas/course/courseCreatePayload.schema';
import { courseUpdate } from './schemas/course/courseUpdatePayload.schema';
import { evaluatorPayload } from './schemas/evaluator/evaluatorCreatePayload.schema';
import { evaluatorUpdate } from './schemas/evaluator/evaluatorUpdatePayload.schema';
import { mentorPayload } from './schemas/mentor/mentorCreatePayload.schema';
import { mentorUpdate } from './schemas/mentor/mentorUpdatePayload.schema';
import { userPasswordSchema } from './schemas/student/studentForgetPassword.schema';
import { userLoginSchema } from './schemas/student/studentLogin.schema';
import { userLogout } from './schemas/student/studentLogout.schema';
import { userRegisterSchema } from './schemas/student/studentRegistration.schema';

/**
 * This is function API's file.
 * @param App express app from express @package.
 * @called from index file.
 */
function routes(App: Express) {
    //health checking api
    App.get('/api/healthCheck', (req: Request, res: Response) => { res.sendStatus(200) });

    //authentication
    App.post('/api/student/register', validate(userRegisterSchema), studentControllers.registerHandler);
    App.post('/api/student/login', validate(userLoginSchema), studentControllers.loginHandler);
    App.post('/api/student/changePassword', validate(userPasswordSchema), studentControllers.changePasswordHandler)
    App.get('/api/student/logout', validate(userLogout), requiredUser, studentControllers.logoutHandler);

    //courses
    App.post('/api/course/create', validate(courserPayload), courseControllers.createCourse);
    App.get('/api/course/courseList', courseControllers.getCourse);
    App.get('/api/course/:courseId', courseControllers.getCourseById);
    App.put('/api/course/update/:courseId', validate(courseUpdate), requiredUser, courseControllers.updateCourse);
    App.delete('/api/course/delete/:courseId', courseControllers.deleteCourse);

    //mentor
    App.post('/api/mentor/create', validate(mentorPayload), mentorControllers.createMentor);
    App.get('/api/mentor/mentorList', mentorControllers.getMentor);
    App.get('/api/mentor/:mentorId', mentorControllers.getMentorById);
    App.put('/api/mentor/update/:mentorId', validate(mentorUpdate), mentorControllers.updateMentor);
    App.delete('/api/mentor/delete/:mentorId', mentorControllers.deleteMentor)

    //evaluator
    App.post('/api/evaluator/create', validate(evaluatorPayload), evaluatorControllers.createEvaluator);
    App.get('/api/evaluator/evaluatorList', evaluatorControllers.getEvaluator);
    App.get('/api/evaluator/:evaluatorId', evaluatorControllers.getEvaluatorById);
    App.put('/api/evaluator/update/:evaluatorId', validate(evaluatorUpdate), evaluatorControllers.updateEvaluator);
    App.delete('/api/evaluator/delete/:evaluatorId', evaluatorControllers.deleteEvaluator)
}
export default routes;


//swagger documentation
// healthcheck
/**
    * @openapi
    * /api/healthCheck:
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

// student API's
/**
    * @openapi
    * '/api/student/register':
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
    * '/api/student/login':
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
    * '/api/student/changePassword':
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
    * '/api/student/logout':
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

//course API's
/**
    * @openapi
    * '/api/course/create':
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
 * '/api/course/courseList':
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
 * '/api/course/{course_id}':
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
    * '/api/course/update/{course_id}':
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
* '/api/course/delete/{course_id}':
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

//mentor API's
/**
    * @openapi
    * '/api/mentor/create':
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
 * '/api/mentor/mentorList':
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
 * '/api/mentor/{mentorId}':
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
    * '/api/mentor/update/{mentorId}':
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
* '/api/mentor/delete/{mentorId}':
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

//evaluator API's
/**
    * @openapi
    * '/api/evaluator/create':
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
 * '/api/evaluator/evaluatorList':
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
 * '/api/evaluator/{evaluatorId}':
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
    * '/api/evaluator/update/{evaluatorId}':
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
* '/api/evaluator/delete/{evaluatorId}':
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