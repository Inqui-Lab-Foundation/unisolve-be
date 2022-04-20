export const conflictError = {
    description: 'Conflict',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: 'String',
                        example: 'error'
                    }
                }
            }
        }
    }
}
export const badRequestError = {
    description: 'Bad Request',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: 'String',
                        example: 'error'
                    }
                }
            }
        }
    }
}
export const unauthorizedError = {
    description: 'unauthorized Request',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: 'String',
                        example: 'error'
                    }
                }
            }
        }
    }
}
export const methodNotAllowedError = {
    description: 'Method Not Allowed Request',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: 'String',
                        example: 'error'
                    }
                }
            }
        }
    }
}


export const studentRegistrationBody = {
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
export const studentLoginBody = {
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
export const studentChangePasswordBody = {
    type: 'object',
    properties: {
        studentId: {
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
    description: 'Register a student',
    operationId: 'createstudent',
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
                    $ref: '#/components/schemas/studentRegistrationBody'
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
                            record: {
                                type: 'object'
                            },
                            message: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        '409': conflictError,
        '404': badRequestError,

    }
}
export const studentLogin = {
    tags: ['Student'],
    description: 'Login a student',
    operationId: 'findstudent',
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
                    $ref: '#/components/schemas/studentLoginBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'student Logged in successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'object'
                            },
                            student_name: {
                                type: 'string'
                            },
                            email: {
                                type: 'string'
                            },
                            accessToken: {
                                type: 'string'
                            },
                            refreshToken: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        '409': conflictError,
        '404': badRequestError,

    }
}
export const studentChangePassword = {
    tags: ['Student'],
    description: 'Change password a student',
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
                    $ref: '#/components/schemas/studentChangePasswordBody'
                },
            },
        },
    },
    responses: {
        '202': {
            description: 'Update the password successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'object'
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError,

    }
}
export const studentLogout = {
    tags: ['Student'],
    description: 'Logout a student',
    operationId: 'logout',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '202': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'object'
                            }
                        }
                    }
                }
            },
            '401': unauthorizedError,
            '405': methodNotAllowedError,
            '404': badRequestError,
        }
    }
}
