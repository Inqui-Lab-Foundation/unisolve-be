import { badRequestError, conflictError, notAcceptable, unauthorizedError } from "./errors";

export const createEvaluatorRequestBody = {
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
export const evaluatorUpdateRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Active',
        }
    },
};

export const createEvaluator = {
    tags: ['Evaluator'],
    description: 'Endpoint for registering new evaluator',
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
                    $ref: '#/components/schemas/createEvaluatorRequestBody'
                },
            },
        },
    },
    responses: {
        '201': {
            description: 'created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'string',
                                example: 'Active'
                            },
                            id: {
                                type: 'number',
                                example: '1'
                            },
                            evaluator_name: {
                                type: 'string',
                                example: 'SundarPichai'
                            },
                            mobile: {
                                type: 'number',
                                example: '126546654695'
                            },
                            email: {
                                type: 'string',
                                example: 'SundarPichai@gmail.com'
                            },
                            createdAt: {
                                type: 'string',
                                example: '2022-05-20T08:19:57.824Z'
                            },
                            updatedAt: {
                                type: 'string',
                                example: '2022-05-20T08:19:57.824Z'
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '406': notAcceptable,
    }
}
export const evaluatorList = {
    tags: ['Evaluator'],
    description: 'Endpoint for getting list of registered evaluator',
    operationId: 'evaluatorList',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'Success',
            content: {
                'applications/json': {
                    schema: {
                        properties: {
                            products: {
                                type: 'array',
                                example: [{
                                    "id": 1,
                                    "evaluator_name": "SundarPichai",
                                    "mobile": 126546654695,
                                    "email": "SundarPichai@gmail.com",
                                    "status": "Active",
                                    "createdAt": "2022-05-20T08:19:57.000Z",
                                    "updatedAt": "2022-05-20T08:19:57.000Z"
                                }]
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '406': notAcceptable
    },
}
export const evaluatorById = {
    tags: ['Evaluator'],
    description: 'Endpoint for getting single evaluator details',
    operationId: 'evaluatorById',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'evaluatorId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add evaluatorId to fetch single evaluator details",
        }
    ],
    responses: {
        '200': {
            description: 'Success',
            content: {
                'applications/json': {
                    schema: {
                        properties: {
                            product: {
                                type: 'object',
                                example: {
                                    "id": 1,
                                    "evaluator_name": "SundarPichai",
                                    "mobile": 126546654695,
                                    "email": "SundarPichai@gmail.com",
                                    "status": "Active",
                                    "createdAt": "2022-05-20T08:19:57.000Z",
                                    "updatedAt": "2022-05-20T08:19:57.000Z"
                                }
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '406': notAcceptable,
    }
}
export const evaluatorByIdUpdate = {
    tags: ['Evaluator'],
    description: 'Endpoint for updating single evaluator details',
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
                    $ref: '#/components/schemas/evaluatorUpdateRequestBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'evaluatorId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add evaluatorId to update single evaluator details",
        }
    ],
    responses: {
        '200': {
            description: 'Success',
            content: {
                'applications/json': {
                    schema: {
                        properties: {
                            response: {
                                type: 'array',
                                example: [
                                    1
                                ]
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '406': notAcceptable,
    }
}
export const evaluatorByIdDelete = {
    tags: ['Evaluator'],
    description: 'Endpoint for removing a single evaluator details',
    operationId: 'evaluatorByIdDelete',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'evaluatorId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add evaluatorId to delete single evaluator details",
        }
    ],
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            deletedEvaluator: {
                                type: 'number',
                                example: 1
                            },
                            text: {
                                type: 'string',
                                example: 'successfully delete the entry'
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '406': notAcceptable,
    }
}