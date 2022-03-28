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

export const createCourseBody = {
    type: 'object',
    properties: {
        module: {
            type: 'string',
            example: '1',
        },
        courser_id: {
            type: 'string',
            example: '126546654695',
        },
        statue: {
            type: 'string',
            example: "Completed"
        }
    }
};
export const courseUpdatesBody = {
    type: 'object',
    properties: {
        statue: {
            type: 'string',
            example: 'Completed',
        }
    },
};

export const createCourse = {
    tags: ['Course'],
    description: 'Create a course entry',
    operationId: 'createCourse',
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
                    $ref: '#/components/schemas/createCourseBody'
                },
            },
        },
    },
    responses: {
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
                            course_id: {
                                type: 'string'
                            },
                            status: {
                                type: 'string'
                            },
                            updatedAt: {
                                type: 'string'
                            },
                            createdAt: {
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
export const courseList = {
    tags: ['Course'],
    description: 'Get the list of the course',
    operationId: 'CourseList',
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
        '404': badRequestError,
    }
}
export const courseById = {
    tags: ['Course'],
    description: 'Get the single course',
    operationId: 'courseById',
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
        '404': badRequestError,
    }
}
export const courseByIdUpdate = {
    tags: ['Course'],
    description: 'update a course entry',
    operationId: 'courseByIdUpdate',
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
                    $ref: '#/components/schemas/courseUpdatesBody'
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
        '404': badRequestError,
    }
}
export const courseByIdDelete = {
    tags: ['Course'],
    description: 'delete the single entry with course id',
    operationId: 'courseByIdDelete',
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
            description: 'Server is up and running',
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError
    }
}