import { badRequestError, conflictError, forbiddenError, methodNotAllowedError, serverError, unauthorizedError } from "./errors";

export const studentRegistrationRequestBody = {
    type: 'object',
    properties: {
        student_name: {
            type: 'string',
            example: 'Shakti',
            describe: 'mandatory field'
        },
        email: {
            type: 'string',
            example: 'Shakti@email.com',
            describe: 'mandatory field'
        },
        password: {
            type: 'string',
            example: '33a4da31c6569c14921f7b068a94b18e',
            describe: 'mandatory field'
        },
        date_of_birth: {
            type: 'string',
            example: '29/05/2003',
            describe: 'mandatory field'
        },
        mobile: {
            type: 'number',
            example: '1234567891',
            describe: 'mandatory field'
        },
        institute_name: {
            type: 'string',
            example: 'something institute of tech',
            describe: 'mandatory field'
        },
        city: {
            type: 'string',
            example: 'Hyderabad',
            describe: 'optional field'
        },
        district: {
            type: 'string',
            example: 'rangareddy',
            describe: 'optional field'
        },
        state: {
            type: 'string',
            example: 'telangana',
            describe: 'optional field'
        },
        country: {
            type: 'string',
            example: 'india',
            describe: 'optional field'
        }
    },
};
export const studentLoginRequestBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'Shakti@email.com',
        },
        password: {
            type: 'string',
            example: '33a4da31c6569c14921f7b068a94b18e',
        }
    },
};
export const studentChangePasswordRequestBody = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            example: 'b0174e75-f9cb-41a0-b71e-916a270ebbc5',
        },
        oldPassword: {
            type: 'string',
            example: '33a4da31c6569c14921f7b068a94b18e',
        },
        newPassword: {
            type: 'string',
            example: '17d3f297d157cfa29bd7fa04023bc56f',
        }
    },
};


export const studentRegistration = {
    tags: ['Student'],
    description: 'Endpoint for registering the new student',
    operationId: 'createStudent',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/studentRegistrationRequestBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'Success',
            content: {
                'application/ json': {
                    schema: {
                        type: 'object',
                        properties: {
                            info: {
                                type: 'object',
                                example: {
                                    "id": "50ce971c-a18b-4d93-b582-69365218bdeb",
                                    "student_name": "Shakti",
                                    "email": "Shakti@email.com",
                                    "date_of_birth": "29/05/2003",
                                    "mobile": 1234567891,
                                    "institute_name": "something institute of tech",
                                    "city": "Hyderabad",
                                    "district": "rangareddy",
                                    "state": "telangana",
                                    "country": "india",
                                    "updatedAt": "2022-05-19T09:42:02.651Z",
                                    "createdAt": "2022-05-19T09:42:02.651Z"
                                }
                            },
                            message: {
                                type: 'string',
                                example: 'Student registered successfully.'
                            }
                        }
                    }
                }
            }
        },
        '404': badRequestError,
        '409': conflictError

    }
}
export const studentLogin = {
    tags: ['Student'],
    description: 'Endpoint for student member login and issues the token',
    operationId: 'findStudent',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/studentLoginRequestBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'object',
                                example: '5'
                            },
                            role: {
                                type: 'string',
                                example: '0'
                            },
                            email: {
                                type: 'string',
                                example: 'student@inqui-lab.org'
                            },
                            Token: {
                                type: 'string',
                                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3VuZEFjY291bnQiOnsiaWQiOjUsIm5hbWUiOiJhZG1pblVzZXIiLCJlbWFpbCI6ImFkbWluQGlucXVpLWxhYi5vcmciLCJwYXNzd29yZCI6IjMzYTRkYTMxYzY1NjljMTQ5MjFmN2IwNjhhOTRiMThlIiwicm9sZSI6IjAiLCJtb2JpbGUiOjg2NTQ3OTM2MjUsIm9yZyI6ImlucXVpLWxhYnMgZm91bmRhdGlvbiIsInN0YXR1cyI6IkFjdGl2ZSIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMThUMDc6NTY6NDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDUtMThUMDc6NTY6NDcuMDAwWiJ9LCJzZXNzaW9uIjoxMjAsImlhdCI6MTY1Mjg4NDgxOCwiZXhwIjoxNjUzMTQ0MDE4fQ.eHawlMNyo4DmZTC8irB-8bI53okOp3YVJ1namBJ7brRV7PTCiu276BLDo8Zt7dB5HA-JfnJh4onig6Ny0XXOLhwrI7jOYWBddsyZN4fPBcn4VLECT6BESu47TzKLkrub2AZfX3SkNngR7wNbuBSGbhZXdnIfo13zuyMuQkVfbu4'
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '403': forbiddenError,

    }
}
export const studentChangePassword = {
    tags: ['Student'],
    description: 'Endpoint for updating the student member password field',
    operationId: 'changePassword',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/studentChangePasswordRequestBody'
                },
            },
        },
    },
    responses: {
        '202': {
            description: 'Accepted',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'object',
                                example: 'Password updated successfully'
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '503': serverError
    }
}
export const studentLogout = {
    tags: ['Student'],
    description: 'Endpoint for clearing the student member session',
    operationId: 'logout',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '202': {
            description: 'Accepted',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'cleared session successfully'
                            }
                        }
                    }
                }
            },
            '401': unauthorizedError,
            '404': badRequestError,
            '409': conflictError
        }
    }
}
