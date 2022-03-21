import healthCheck from "./apiCheck.api.docs";
import { version } from '../../package.json';
import { studentRegistration, studentLogin, studentChangePassword, studentLogout, studentRegistrationBody, studentLoginBody, studentChangePasswordBody } from "./api.student.docs";
import { courseList, createCourse, courseById, courseByIdUpdate, courseByIdDelete } from "./api.course.docs";

// define Swagger options with specific properties
const options = {
    openapi: '3.0.1',
    info: {
        title: "Unislove API Docs",
        description: "Unislove backend applications api documentation with in details API description",
        version,
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [
        {
            url: 'http://localhost:3002',
            description: 'Local Server',
        },
        {
            url: 'http://15.207.254.154:3002',
            description: 'Production Server',
        },
    ],
    tags: [
        {
            name: 'HealthCheck',
        },
        {
            name: 'Authorization',
        },
        {
            name: 'Course',
        },
        {
            name: 'Mentor',
        },
        {
            name: 'Evaluator',
        },
    ],
    paths: {
        '/api/v1/healthCheck': {
            get: healthCheck,
        },
        '/api/v1/student/register': {
            post: studentRegistration
        },
        '/api/v1/student/login': {
            post: studentLogin
        },
        '/api/v1/student/changePassword': {
            put: studentChangePassword
        },
        '/api/v1/student/logout': {
            get: studentLogout
        },
        '/api/v1/course/create': {
            post: createCourse
        },
        '/api/v1/course/courseList': {
            get: courseList
        },
        '/api/v1/course/{course_id}': {
            get: courseById
        },
        // '/api/v1/course/{course_id}': {
        //     update: courseByIdUpdate
        // },
        // '/api/v1/course/{course_id}': {
        //     delete: courseByIdDelete
        // },  

    },
    components: {
        securitySchemas: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            studentRegistrationBody,
            studentLoginBody,
            studentChangePasswordBody
        },
    },
};

export { options };