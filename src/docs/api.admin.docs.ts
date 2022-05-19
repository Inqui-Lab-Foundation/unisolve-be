import { conflictError, forbiddenError, serverError, unauthorizedError } from "./errors";

export const adminRegistrationRequestBody = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            example: 'adminUser',
            describe: 'mandatory field'
        },
        email: {
            type: 'string',
            example: 'admin@inqui-lab.org',
            describe: 'mandatory field'
        },
        password: {
            type: 'string',
            example: '33a4da31c6569c14921f7b068a94b18e',
            describe: 'mandatory field'
        },
        role: {
            type: 'string',
            example: '0',
            describe: 'mandatory field'
        },
        mobile: {
            type: 'number',
            example: '8654793625',
            describe: 'mandatory field'
        },
        org: {
            type: 'string',
            example: 'inqui-labs foundation'
        },
        status: {
            type: 'string',
            example: 'active',
            describe: 'not mandatory field'
        },

    },
};
export const adminLoginRequestBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'admin@inqui-lab.org',
        },
        password: {
            type: 'string',
            example: '33a4da31c6569c14921f7b068a94b18e',
        }
    },
};
export const adminChangePasswordRequestBody = {
    type: 'object',
    properties: {
        Id: {
            type: 'string',
            example: '2',
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
export const adminCreateSignupConfigRequestBody = {
    type: 'object',
    properties: {
        studentName: {
            type: 'boolean',
            example: 'true',
        },
        email: {
            type: 'boolean',
            example: 'true',
        },
        phNumber: {
            type: 'boolean',
            example: 'true',
        }
    },
};

export const adminRegistration = {
    tags: ['Admin'],
    description: 'Endpoint for registering the new admin member',
    operationId: 'createAdmin',
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
                    $ref: '#/components/schemas/adminRegistrationRequestBody'
                },
            },
        },
    },
    responses: {
        '201': {
            description: 'Success',
            content: {
                'application/ json': {
                    schema: {
                        type: 'object',
                        properties: {
                            info: {
                                type: 'object',
                                example: {
                                    "id": 5,
                                    "name": "adminUser",
                                    "email": "admin@inqui-lab.org",
                                    "role": "0",
                                    "mobile": 8654793625,
                                    "org": "inqui-labs foundation",
                                    "status": "active",
                                    "updatedAt": "2022-05-18T07:56:47.462Z",
                                    "createdAt": "2022-05-18T07:56:47.462Z"
                                }
                            },
                            message: {
                                type: 'string',
                                example: 'Admin registered successfully.'
                            }
                        }
                    }
                }
            }
        },
        '409': conflictError,
        '500': serverError
    }
}
export const adminLogin = {
    tags: ['Admin'],
    description: 'Endpoint for admin member login and issues the token',
    operationId: 'findAdmin',
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
                    $ref: '#/components/schemas/adminLoginRequestBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                example: '5'
                            },
                            role: {
                                type: 'string',
                                example: '0'
                            },
                            email: {
                                type: 'string',
                                example: 'admin@inqui-lab.org'
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
        '403': forbiddenError
    }
}
export const adminChangePassword = {
    tags: ['Admin'],
    description: 'Endpoint for updating the admin member password field',
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
                    $ref: '#/components/schemas/adminChangePasswordRequestBody'
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
                                type: 'string',
                                example: 'Password updated successfully'
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '503': serverError
    }
}
export const adminLogout = {
    tags: ['Admin'],
    description: 'Endpoint for clearing the admin member session',
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
            '409': conflictError
        }
    }
}
export const createStudentConfig = {
    tags: ['Admin'],
    description: 'Endpoint for creating a dynamic json file in the server',
    operationId: 'createStudentConfig',
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
                    $ref: '#/components/schemas/adminCreateSignupConfigRequestBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'successfully created json file'
                            }
                        }
                    }
                }
            },
            '401': unauthorizedError,
            '503': serverError
        }
    }
}
export const getStudentConfig = {
    tags: ['Admin'],
    description: 'Endpoint for getting json file dynamically created',
    operationId: 'getStudentConfig',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'Created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'object',
                                example: {
                                    'studentName': {
                                        type: 'text',
                                        name: 'studentName',
                                        required: true,
                                        selected: true,
                                        value: 'name'
                                    },
                                    'email': {
                                        type: 'text',
                                        name: 'email',
                                        required: true,
                                        selected: true,
                                        value: 'name'
                                    },
                                    'phNumber': {
                                        type: 'number',
                                        name: 'phNumber',
                                        required: false,
                                        selected: true,
                                        value: 'number'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '401': unauthorizedError
        }
    }
}
