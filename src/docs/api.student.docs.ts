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
        },
        email: {
            type: 'string',
            example: 'Shakti@email.com',
        },
        password: {
            type: 'string',
            example: 'Shakti@12345',
        },
        date_of_birth: {
            type: 'string',
            example: '29/05/2003',
        },
        mobile: {
            type: 'number',
            example: '1234567891',
        },
        institute_name: {
            type: 'string',
            example: 'something institute of tech',
        },
    },
};
export const studentLoginBody = {
    type: 'object',
    properties: {
        student_name: {
            type: 'string',
            example: 'John Snow',
        },
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
        },
        date_of_birth: {
            type: 'string',
            example: '29/05/2003',
        },
        mobile: {
            type: 'number',
            example: '1234567891',
        },
        institute_name: {
            type: 'string',
            example: 'something institute of tech',
        },
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
    response: {
        '200': {
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
    response: {
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
                            email: {
                                type: 'string'
                            },
                            name: {
                                type: 'string'
                            },
                            createdAt: {
                                type: 'string'
                            },
                            updateAt: {
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
    response: {
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
    response: {
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
