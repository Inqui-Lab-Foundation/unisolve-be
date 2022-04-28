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


export const adminRegistrationBody = {
    type: 'object',
    properties: {
        name: {
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
        role: {
            type: 'string',
            example: '0',
            describe: 'mandatory field'
        },
        mobile: {
            type: 'number',
            example: '1234567891',
            describe: 'mandatory field'
        },
        org: {
            type: 'string',
            example: 'something institute of tech',
            describe: 'not mandatory field'
        },
        status: {
            type: 'string',
            example: 'active',
            describe: 'not mandatory field'
        },
        
    },
};
export const adminLoginBody = {
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
export const adminChangePasswordBody = {
    type: 'object',
    properties: {
        Id: {
            type: 'string',
            example: '1',
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


export const adminRegistration = {
    tags: ['Admin'],
    description: 'Register a admin',
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
                    $ref: '#/components/schemas/adminRegistrationBody'
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
export const adminLogin = {
    tags: ['Admin'],
    description: 'Login a admin',
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
                    $ref: '#/components/schemas/adminLoginBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'admin Logged in successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'object'
                            },
                            admin_name: {
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
export const adminChangePassword = {
    tags: ['Admin'],
    description: 'Change password a admin',
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
                    $ref: '#/components/schemas/adminChangePasswordBody'
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
export const adminLogout = {
    tags: ['Admin'],
    description: 'Logout a admin',
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
