/*Importing the dependencies*/
import { Express, Request, Response } from 'express';
import studentControllers from './controllers/student.controllers';

import validate from './middleware/validateResource';
import { userLoginSchema } from './schemas/student/studentLogin.schema';
import { userRegisterSchema } from './schemas/student/studentRegistration.schema';

/**
 * This is function API's file.
 * @param App express app from express @package.
 * @called from index file.
 */
function routes(App: Express) {

    App.get('/api/healthCheck', (req: Request, res: Response) => { res.sendStatus(200) });

    App.post('/api/student/register', validate(userRegisterSchema), studentControllers.registerHandler);

    App.post('/api/student/login', validate(userLoginSchema), studentControllers.loginHandler)

    //   App.get('/api/user/sessions', requiredUser, getUserSessionsHandler);

    //   App.delete('/api/user/sessions', requiredUser, deleteUserSessionHandler);

    //   App.post("/api/products", [requiredUser, validate(createProductSchema)],
    // createProductHandler);

    //   App.get("/api/products/:productId", getProductHandler);

    //   App.put("/api/products/:productId", updateProductHandler );

    //   App.delete("/api/products/:productId", requiredUser, deleteProductHandler);
}

export default routes;


/**
    * @openapi
    * /healthcheck:
    *  get:
    *     tags:
    *     - Healthcheck
    *     description: Responds if the app is up and running
    *     parameters: 
    *       Null 
    *     responses:
    *       200:
    *         description: App is up and running
    */

/**
    * @openapi
    * '/api/users/signup':
    *  post:
    *     tags:
    *     - User
    *     summary: Register a User
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
    * '/api/users/signin':
    *  post:
    *     tags:
    *     - User
    *     summary: Login a User
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
    * '/api/user/sessions':
    *  get:
    *     tags:
    *     - User
    *     summary: List of sessions
    *     responses:
    *       200:
    *         description: Success
    *       401:
    *         description: Unauthorized 
    *       400:
    *         description: Bad request
    */

/**
    * @openapi
    * '/api/sessions':
    *  delete:
    *     tags:
    *     - User
    *     summary: Delete session
    *     responses:
    *       200:
    *         description: Success
    *       401:
    *         description: Unauthorized 
    *       400:
    *         description: Bad request
    */

/**
  * @openapi
  * '/api/products':
  *  post:
  *     tags:
  *     - Products
  *     summary: Create a new product
  *     requestBody:
  *      required: true
  *      content: 
  *        application/json:
  *           schema: 
  *              $ref: '#/components/schemas/CreateProduct'
  *     responses:
  *       200:
  *         description: Success
  *         content:
  *           application/json:
  *             schema: 
  *                ref: '#/components/schemas/ProductResponse'
  *       403:
  *         description: Forbidden 
  *       400:
  *         description: Bad request
  */

/**
    * @openapi
    * '/api/products/{productId}':
    *  get:
    *     tags:
    *     - Products
    *     summary: Get a single product by the productId
    *     parameters:
    *      - name: productId
    *        in: path
    *        description: The id of the product
    *        required: true
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *          application/json:
    *           schema:
    *              $ref: '#/components/schemas/GetProduct'
    *       404:
    *         description: Product not found
    */

/**
  * @openapi
  * '/api/products/{productId}':
  *  put:
  *     tags:
  *     - Products
  *     summary: Update single product by the productId
  *     parameters:
  *      - name: productId
  *        in: path
  *        description: The id of the product
  *        required: true
  *     requestBody:
  *      required: true
  *      content: 
  *        application/json:
  *           schema: 
  *              $ref: '#/components/schemas/CreateProduct'
  *     responses:
  *       200:
  *         description: Success
  *         content:
  *           application/json:
  *             schema: 
  *                ref: '#/components/schemas/ProductResponse'
  *       403:
  *         description: Forbidden 
  *       400:
  *         description: Bad request
  */

/**
    * @openapi
    * '/api/products/{productId}':
    *  delete:
    *     tags:
    *     - Products
    *     summary: Delete single product by productId
    *     parameters:
    *      - name: productId
    *        in: path
    *        description: The id of product
    *        required: true
    *     responses:
    *       200:
    *         description: Success
    *       401:
    *         description: Unauthorized 
    *       400:
    *         description: Bad request
    */