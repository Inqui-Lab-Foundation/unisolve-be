/*Importing the dependencies*/
import { Express, Request, Response } from 'express';

import courseControllers from './controllers/course.controllers';
import studentControllers from './controllers/student.controllers';
import requiredUser from './middleware/student/requiredLogin';

import validate from './middleware/validateResource';
import { courserPayload } from './schemas/course/courseCreatePayload.schema';
import { CourseUpdate } from './schemas/course/courseUpdatePayload.schema';
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
    App.post('/api/course/create', validate(courserPayload), requiredUser, courseControllers.createCourse);
    App.get('/api/course/courseList', requiredUser, courseControllers.getCourse);
    App.get('/api/course/:courseId', requiredUser, courseControllers.getCourseById);
    App.put('/api/course/update/:courseId', validate(CourseUpdate), requiredUser, courseControllers.updateCourse);
    App.delete('/api/course/delete/:courseId', requiredUser, courseControllers.deleteCourse)
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