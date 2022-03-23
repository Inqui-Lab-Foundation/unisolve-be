import healthCheck from "./apiCheck.api.docs";
import { version } from '../../package.json';
import { studentRegistration, studentLogin, studentChangePassword, studentLogout, studentRegistrationBody, studentLoginBody, studentChangePasswordBody } from "./api.student.docs";
import { courseList, createCourse, courseById, courseByIdUpdate, courseByIdDelete, createCourseBody, courseUpdatesBody } from "./api.course.docs";
import { createMentor, mentorById, mentorByIdDelete, mentorByIdUpdate, mentorList } from "./api.mentor.docs";
import { createEvaluator, evaluatorById, evaluatorByIdDelete, evaluatorByIdUpdate, evaluatorList } from "./api.evaluator.docs";

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
        '/api/v1/course/list': {
            get: courseList
        },
        '/api/v1/course/get/{courseId}': {
            get: courseById
        },
        '/api/v1/course/update/{courseId}': {
            put: courseByIdUpdate
        },
        '/api/v1/course/delete/{courseId}': {
            delete: courseByIdDelete
        },
        '/api/v1/mentor/create': {
            post: createMentor
        },
        '/api/v1/mentor/list': {
            get: mentorList
        },
        '/api/v1/mentor/get/{courseId}': {
            get: mentorById
        },
        '/api/v1/mentor/update/{courseId}': {
            put: mentorByIdUpdate
        },
        '/api/v1/mentor/delete/{courseId}': {
            delete: mentorByIdDelete
        },
        '/api/v1/evaluator/create': {
            post: createEvaluator
        },
        '/api/v1/evaluator/list': {
            get: evaluatorList
        },
        '/api/v1/evaluator/get/{courseId}': {
            get: evaluatorById
        },
        '/api/v1/evaluator/update/{courseId}': {
            put: evaluatorByIdUpdate
        },
        '/api/v1/evaluator/delete/{courseId}': {
            delete: evaluatorByIdDelete
        },

    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            studentRegistrationBody,
            studentLoginBody,
            studentChangePasswordBody,
            createCourseBody,
            courseUpdatesBody
        },
    },
};

export { options };