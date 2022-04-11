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
export const createEvaluatorBody = {
    type: 'object',
    properties: {
        evaluator_name: {
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
export const evaluatorUpdateBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};
export const createEvaluator = {
    tags: ['Evaluator'],
    description: 'Create a evaluator entry',
    operationId: 'createEvaluator',
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
                            evaluator_id: {
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
export const evaluatorList = {
    tags: ['Evaluator'],
    description: 'Get the list of the evaluator',
    operationId: 'evaluatorList',
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
    },
}
export const evaluatorById = {
    tags: ['Evaluator'],
    description: 'Get the single evaluator',
    operationId: 'evaluatorById',
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
export const evaluatorByIdUpdate = {
    tags: ['Evaluator'],
    description: 'update a evaluator entry',
    operationId: 'evaluatorByIdUpdate',
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
export const evaluatorByIdDelete = {
    tags: ['Evaluator'],
    description: 'delete the single entry with evaluator id',
    operationId: 'evaluatorByIdDelete',
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
        '404': badRequestError
    }
}