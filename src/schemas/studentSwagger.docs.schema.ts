// Swagger Documentation
/**
 * @openapi
 * components:
 *  schemas:
 *    userRegisterInput:
 *      type: object
 *      required: 
 *        - student_name
 *        - email
 *        - password
 *        - passwordConfirmation
 *        - date_of_birth
 *        - mobile
 *        - institute_name
 *      properties:
 *        student_name: 
 *          type: string
 *          default: vamshi
 *        email: 
 *          type: string
 *          default: vamshi@someunnameweb.com
 *        password: 
 *          type: string
 *          default: vamshi@1234
 *        passwordConfirmation: 
 *          type: string
 *          default: vamshi@1234
 *        date_of_birth: 
 *          type: string
 *          default: 25/05/1995
 *        mobile: 
 *          type: number
 *          default: 1234567891
 *        institute_name: 
 *          type: string
 *          default: something institute of tech
 *    userRegisterResponse:
 *      type: object
 *      properties:
 *        record: 
 *          type: object
 *        message: 
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
 *    userChangePassword:
 *      type: object
 *      required: 
 *        - email
 *        - newPassword
 *        - passwordConfirmation
 *      properties:
 *        email: 
 *          type: string
 *          default: vamshi@someunnameweb.com
 *        newPassword: 
 *          type: string
 *          default: vamshi@1234
 *        passwordConfirmation: 
 *          type: string
 *          default: vamshi@1234
 *    userChangePasswordResponse:
 *      type: object
 *      properties:
 *        message: 
 *          type: string
 *    createCoursePayload:
 *      type: object
 *      required:
 *        - module
 *        - courser_id
 *        - statue
 *      properties:
 *        module:
 *          type: string
 *          default: 1
 *        courser_id:
 *          type: string
 *          default: 244244
 *        statue:
 *          type: string
 *          default: "Completed"
 *    createCourseResponse:
 *      type: object
 *      properties:
 *        id:
 *         type: string
 *        module:
 *         type: string
 *        courser_id:
 *         type: string
 *        statue:
 *         type: string
 *        updatedAt:
 *         type: string       
 *        createdAt:
 *         type: string
 *    courseUpdatePayload:             
 *      type: object
 *      required:
 *        - statue
 *      properties:
 *        statue:
 *          type: sting
 *          default: "Complete"         
 *    courseUpdateRepose:
 *      type: array                                                      
 * 
 */