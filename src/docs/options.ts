import healthCheck from "./apiCheck.api.docs";
import { version } from '../../package.json';
import {
    studentRegistration,
    studentLogin,
    studentChangePassword,
    studentLogout,
    studentRegistrationRequestBody,
    studentLoginRequestBody,
    studentChangePasswordRequestBody
} from "./api.student.docs";
import {
    adminRegistration,
    adminLogin,
    adminChangePassword,
    adminLogout,
    adminRegistrationRequestBody,
    adminLoginRequestBody,
    adminChangePasswordRequestBody,
    getStudentConfig,
    createStudentConfig,
    adminCreateSignupConfigRequestBody
} from "./api.admin.docs";
import {
    courseList,
    createCourse,
    courseById,
    courseByIdUpdate,
    courseByIdDelete,
    createCourseRequestBody,
    courseUpdatesRequestBody
} from "./api.course.docs";
import {
    moduleList,
    createModule,
    moduleById,
    moduleByIdUpdate,
    moduleByIdDelete,
    createModuleRequestBody,
    moduleUpdatesRequestBody
} from "./api.module.docs";
import {
    videosList,
    createVideos,
    videosById,
    videosByIdUpdate,
    videosByIdDelete,
    createVideosRequestBody,
    videosUpdatesRequestBody,
} from "./api.video.docs";
import {
    createMentor,
    mentorById,
    createMentorRequestBody,
    mentorUpdateRequestBody,
    mentorByIdDelete,
    mentorByIdUpdate,
    mentorList
} from "./api.mentor.docs";
import {
    createEvaluator,
    evaluatorById,
    evaluatorByIdDelete,
    evaluatorByIdUpdate,
    evaluatorList,
    createEvaluatorRequestBody,
    evaluatorUpdateRequestBody
} from "./api.evaluator.docs";

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
    server: [
        {
            url: 'http://localhost:3002',
            description: 'development Server',
        },
    ],
    schemes: ['https', 'http'],
    tags: [
        {
            name: 'HealthCheck',
        },
        {
            name: 'Admin',
        },
        {
            name: 'Student',
        },
        {
            name: 'Course',
        },
        {
            name: 'Modules',
        },
        {
            name: 'Videos',
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
        '/api/v1/admin/register': {
            post: adminRegistration
        },
        '/api/v1/admin/login': {
            post: adminLogin
        },
        '/api/v1/admin/changePassword': {
            put: adminChangePassword
        },
        '/api/v1/admin/logout': {
            get: adminLogout
        },
        '/api/v1/admin/setupStudentConfig': {
            post: createStudentConfig
        },
        '/api/v1/admin/getStudentConfig': {
            get: getStudentConfig
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
        '/api/v1/modules/create': {
            post: createModule
        },
        '/api/v1/modules/list': {
            get: moduleList
        },
        '/api/v1/modules/get/{moduleId}': {
            get: moduleById
        },
        '/api/v1/modules/update/{moduleId}': {
            put: moduleByIdUpdate
        },
        '/api/v1/modules/delete/{moduleId}': {
            delete: moduleByIdDelete
        },
        '/api/v1/video/create': {
            post: createVideos
        },
        '/api/v1/video/list': {
            get: videosList
        },
        '/api/v1/video/get/{videoId}': {
            get: videosById
        },
        '/api/v1/video/update/{videoId}': {
            put: videosByIdUpdate
        },
        '/api/v1/video/delete/{videoId}': {
            delete: videosByIdDelete
        },
        '/api/v1/mentor/create': {
            post: createMentor
        },
        '/api/v1/mentor/list': {
            get: mentorList
        },
        '/api/v1/mentor/get/{mentorId}': {
            get: mentorById
        },
        '/api/v1/mentor/update/{mentorId}': {
            put: mentorByIdUpdate
        },
        '/api/v1/mentor/delete/{mentorId}': {
            delete: mentorByIdDelete
        },
        '/api/v1/evaluator/create': {
            post: createEvaluator
        },
        '/api/v1/evaluator/list': {
            get: evaluatorList
        },
        '/api/v1/evaluator/get/{evaluatorId}': {
            get: evaluatorById
        },
        '/api/v1/evaluator/update/{evaluatorId}': {
            put: evaluatorByIdUpdate
        },
        '/api/v1/evaluator/delete/{evaluatorId}': {
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
            studentRegistrationRequestBody,
            studentLoginRequestBody,
            studentChangePasswordRequestBody,
            adminRegistrationRequestBody,
            adminLoginRequestBody,
            adminChangePasswordRequestBody,
            adminCreateSignupConfigRequestBody,
            createCourseRequestBody,
            courseUpdatesRequestBody,
            createModuleRequestBody,
            moduleUpdatesRequestBody,
            createVideosRequestBody,
            videosUpdatesRequestBody,
            createMentorRequestBody,
            mentorUpdateRequestBody,
            createEvaluatorRequestBody,
            evaluatorUpdateRequestBody
        },
    },
};

export { options };