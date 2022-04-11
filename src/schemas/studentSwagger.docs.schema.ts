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
 * 
 *    createCoursePayload:
 *      type: object
 *      required:
 *        - module
 *        - courser_id
 *        - status
 *      properties:
 *        module:
 *          type: string
 *          default: 1
 *        courser_id:
 *          type: string
 *          default: 244244
 *        status:
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
 *        status:
 *         type: string
 *        updatedAt:
 *         type: string       
 *        createdAt:
 *         type: string
 *    courseUpdatePayload:             
 *      type: object
 *      required:
 *        - status
 *      properties:
 *        status:
 *          type: sting
 *          default: "Complete"         
 *    courseUpdateRepose:
 *      type: array
 * 
 *    createMentorPayload:
 *      type: object
 *      required:
 *        - mentor_name
 *        - mobile
 *        - email
 *      properties:
 *        mentor_name:
 *          type: string
 *          default: "abcd"
 *        mobile:
 *          type: string
 *          default: 24424454544
 *        email:
 *          type: string
 *          default: "gmail@Completed.com"
 *    createMentorResponse:
 *      type: object
 *      properties:
 *        id:
 *         type: string
 *        mentor_name:
 *         type: string
 *        mobile:
 *         type: string
 *        email:
 *         type: string
 *        updatedAt:
 *         type: string       
 *        createdAt:
 *         type: string
 *    mentorUpdatePayload:             
 *      type: object
 *      required:
 *        - status
 *      properties:
 *        status:
 *          type: sting
 *          default: "Active"         
 *    mentorUpdateRepose:
 *      type: array  
 * 
 *    createEvaluatorPayload:
 *      type: object
 *      required:
 *        - evaluator_name
 *        - mobile
 *        - email
 *      properties:
 *        evaluator_name:
 *          type: string
 *          default: "abcd"
 *        mobile:
 *          type: string
 *          default: 24424454544
 *        email:
 *          type: string
 *          default: "gmail@Completed.com"
 *    createEvaluatorResponse:
 *      type: object
 *      properties:
 *        id:
 *         type: string
 *        evaluator_name:
 *         type: string
 *        mobile:
 *         type: string
 *        email:
 *         type: string
 *        updatedAt:
 *         type: string       
 *        createdAt:
 *         type: string
 *    evaluatorUpdatePayload:             
 *      type: object
 *      required:
 *        - status
 *      properties:
 *        status:
 *          type: sting
 *          default: "Active"         
 *    evaluatorUpdateRepose:
 *      type: array                                                 
 * 
 */