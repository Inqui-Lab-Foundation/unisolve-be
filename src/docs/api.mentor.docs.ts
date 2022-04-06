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
export const createMentorBody = {
    type: 'object',
    properties: {
        mentor_name: {
            type: 'string',
            example: 'SundarPichai',
        },
        mobile: {
            type: 'number',
            example: 126546654695,
        },
        email: {
            type: 'string',
            example: "SundarPichai@gmail.com"
        }
    }
};
export const mentorUpdateBody = {
    type: 'object',
    properties: {
        statue: {
            type: 'string',
            example: 'Completed',
        }
    },
};
export const createMentor = {
    tags: ['Mentor'],
    description: 'Create a mentor entry',
    operationId: 'createMentor',
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
                    $ref: '#/components/schemas/createMentorBody'
                },
            },
        },
    },
    response: {
        '200': {
            description: 'New Entry added successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string'
                            },
                            module: {
                                type: 'string'
                            },
                            mentor_id: {
                                type: 'string'
                            },
                            status: {
                                type: 'string'
                            },
                            updateAt: {
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
export const mentorList = {
    tags: ['Mentor'],
    description: 'Get the list of the mentor',
    operationId: 'mentorList',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '202': {
            description: 'Success',
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError
    }
}
export const mentorById = {
    tags: ['Mentor'],
    description: 'Get the single mentor',
    operationId: 'mentorById',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'courseId',
            schema: {
                type: 'integer',
                default: 963258
            },
            required: true,
            description: "courseId to fetch",
        }
    ],
    responses: {
        '202': {
            description: 'Success',
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError
    }
}
export const mentorByIdUpdate = {
    tags: ['Mentor'],
    description: 'update a mentor entry',
    operationId: 'mentorByIdUpdate',
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
                    $ref: '#/components/schemas/mentorUpdateBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'courseId',
            schema: {
                type: 'integer',
                default: 963258
            },
            required: true,
            description: "courseId to fetch",
        }
    ],
    responses: {
        '200': {
            description: 'updated',
            content: {
                'application/json': {
                    schema: {
                        type: 'array'
                    }
                }
            }
        },
        '401': unauthorizedError,
        '409': conflictError,
        '404': badRequestError
    }
}
export const mentorByIdDelete = {
    tags: ['Mentor'],
    description: 'delete the single entry with mentor id',
    operationId: 'mentorByIdDelete',
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
                    $ref: '#/components/schemas/createUserBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'courseId',
            schema: {
                type: 'integer',
                default: 963258
            },
            required: true,
            description: "courseId to fetch",
        }
    ],
    responses: {
        '202': {
            description: 'Server is up and running',
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError,
    }
}