import { healthCheck, home } from "./healthCheck.api.docs";
import { version } from '../../package.json';
import {
    courseList,
    createCourse,
    courseById,
    courseByIdUpdate,
    courseByIdDelete,
    createCourseRequestBody,
    courseUpdatesRequestBody
} from "./course.api.docs";
import {
    moduleList,
    createModule,
    moduleById,
    moduleByIdUpdate,
    moduleByIdDelete,
    createModuleRequestBody,
    moduleUpdatesRequestBody
} from "./module.api.docs";
import {
    videosList,
    createVideos,
    videosById,
    videosByIdUpdate,
    videosByIdDelete,
    createVideosRequestBody,
    videosUpdatesRequestBody,
} from "./video.api.docs";
import {
    create_dynamicSignupForm,
    get_dynamicSignupForm,
    login,
    logout,
    registration,
    registrationRequestBody,
    loginRequestBody,
    dynamicSignupFormRequestBody
} from "./auth.api.docs";
import {
    createCrud, createCrudWithFile, crudDelete, crudList, crudUpdate, crudUpdateWithFile, crudRequestBodyWithFile, crudRequestBody,
    crudUpdatesRequestBodyWithFile,
    crudSingle,
} from "./crud.api.docs";
import { createTeam, teamByIdDelete, teamsById, teamsByIdUpdate, teamsList, createTeamRequestBody, teamUpdatesRequestBody } from "./team.api.docs";
import { notificationsTome, notificationWithPoster, notification, notificationsWithPosterRequestBody, notificationsRequestBody } from "./notification.api.docs";

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
            name: 'Home',
        },
        {
            name: 'Authentication',
        },
        {
            name: 'Crud',
        },
        {
            name: 'Courses',
        },
        {
            name: 'Modules',
        },
        {
            name: 'Videos',
        },
        {
            name: 'Teams',
        },
        {
            name: 'Notifications',
        },
    ],
    paths: {
        '/': {
            get: home
        },
        '/healthCheck': {
            get: healthCheck,
        },
        //auth
        '/api/v1/auth/register': {
            post: registration
        },
        '/api/v1/auth/login': {
            post: login
        },
        '/api/v1/auth/logout': {
            get: logout
        },
        //crud
        '/api/v1/auth/dynamicSignupForm': {
            post: create_dynamicSignupForm,
            get: get_dynamicSignupForm
        },
        '/api/v1/crud/{model_name}': {
            post: createCrud,
            get: crudList
        },
        '/api/v1/crud/{model_name}/{id}': {
            get: crudSingle,
            put: crudUpdate,
            delete: crudDelete
        },
        '/api/v1/crud/{model_name}/withfile': {
            post: createCrudWithFile,
            put: crudUpdateWithFile
        },
        //course
        '/api/v1/course': {
            post: createCourse,
            get: courseList
        },
        '/api/v1/course/{course_id}': {
            get: courseById,
            put: courseByIdUpdate,
            delete: courseByIdDelete
        },
        //modules
        '/api/v1/modules': {
            post: createModule,
            get: moduleList
        },
        '/api/v1/modules/{module_id}': {
            get: moduleById,
            put: moduleByIdUpdate,
            delete: moduleByIdDelete
        },
        //videos
        '/api/v1/videos/': {
            post: createVideos,
            get: videosList
        },
        '/api/v1/videos/{video_id}': {
            get: videosById,
            put: videosByIdUpdate,
            delete: videosByIdDelete
        },
        //teams
        '/api/v1/teams/': {
            post: createTeam,
            get: teamsList
        },
        '/api/v1/teams/{team_id}': {
            get: teamsById,
            put: teamsByIdUpdate,
            delete: teamByIdDelete
        },
        //Notifications
        '/api/v1/notifications/tome': {
            get: notificationsTome
        },
        '/api/v1/notifications/send': {
            post: notification
        },
        '/api/v1/notifications/sendwithposter': {
            post: notificationWithPoster
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
            registrationRequestBody,
            loginRequestBody,
            dynamicSignupFormRequestBody,
            crudRequestBody,
            crudRequestBodyWithFile,
            crudUpdatesRequestBodyWithFile,
            createCourseRequestBody,
            courseUpdatesRequestBody,
            createModuleRequestBody,
            moduleUpdatesRequestBody,
            createVideosRequestBody,
            videosUpdatesRequestBody,
            createTeamRequestBody,
            teamUpdatesRequestBody,
            notificationsWithPosterRequestBody,
            notificationsRequestBody
        },
    },
};

export { options };