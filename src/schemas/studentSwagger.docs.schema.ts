// Swagger Documentation
/**
 * @openapi
 * components:
 *  schemas:
 *    userRegisterInput:
 *      type: object
 *      required: 
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email: 
 *          type: string
 *          default: vamshi@someunnameweb.com
 *        name: 
 *          type: string
 *          default: vamshi
 *        password: 
 *          type: string
 *          default: vamshi@1234
 *        passwordConfirmation: 
 *          type: string
 *          default: vamshi@1234
 *    userRegisterResponse:
 *      type: object
 *      properties:
 *        email: 
 *          type: string
 *        name: 
 *          type: string
 *        _id: 
 *          type: string
 *        createdAt: 
 *          type: string  
 *        updateAt: 
 *          type: string  
 *    userLoginInput:
 *      type: object
 *      required: 
 *        - email
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email: 
 *          type: string
 *          default: vamshi@someunnameweb.com
 *        password: 
 *          type: string
 *          default: vamshi@1234
 *        passwordConfirmation: 
 *          type: string
 *          default: vamshi@1234
 *    userLoginResponse:
 *      type: object
 *      properties:
 *        _id: 
 *          type: string
 *        email: 
 *          type: string
 *        name: 
 *          type: string
 *        createdAt: 
 *          type: string  
 *        updateAt: 
 *          type: string  
 *        accessToken: 
 *          type: string  
 *        refreshToken: 
 *          type: string  
 */