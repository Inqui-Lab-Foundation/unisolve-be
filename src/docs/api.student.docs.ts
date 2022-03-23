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
            example: 'Shakti@12345',
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
            example: 'john.snow@email.com',
        },
        password: {
            type: 'string',
            example: '!1234aWe1Ro3$#',
        },
        passwordConfirmation: {
            type: 'string',
            example: '!1234aWe1Ro3$#',
        }
    },
};
export const studentChangePasswordBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'john.snow@email.com',
        },
        newPassword: {
            type: 'string',
            example: '!1234aWe1Ro3$#',
        },
        passwordConfirmation: {
            type: 'string',
            example: '!1234aWe1Ro3$#',
        }
    },
};


export const studentRegistration = {
    tags: ['Authorization'],
    description: 'Register a student',
    operationId: 'createUser',
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
    tags: ['Authorization'],
    description: 'Login a student',
    operationId: 'findUser',
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
            description: 'Student Logged in successfully',
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
    tags: ['Authorization'],
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
    tags: ['Authorization'],
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
            }
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError,

    }
}
