import { notAcceptable, badRequestError, unauthorizedError, methodNotAllowedError } from "./errors";


export const createMentorRequestBody = {
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
export const mentorUpdateRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Active',
        }
    },
};
export const createMentor = {
    tags: ['Mentor'],
    description: 'Endpoint for registering new mentor',
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
                    $ref: '#/components/schemas/createMentorRequestBody'
                },
            },
        },
    },
    responses: {
        '201': {
            description: 'Created',
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
                            mentor_name: {
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
export const mentorList = {
    tags: ['Mentor'],
    description: 'Endpoint for getting list of registered mentor',
    operationId: 'mentorList',
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
                                    "mentor_name": "SundarPichai",
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
    }
}
export const mentorById = {
    tags: ['Mentor'],
    description: 'Endpoint for getting single mentor details',
    operationId: 'mentorById',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'mentorId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add evaluatorId to fetch single mentor details",
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
export const mentorByIdUpdate = {
    tags: ['Mentor'],
    description: 'Endpoint for updating single mentor details',
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
                    $ref: '#/components/schemas/mentorUpdateRequestBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'mentorId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add mentorId to update single evaluator details"
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
export const mentorByIdDelete = {
    tags: ['Mentor'],
    description: 'Endpoint for removing a single mentor details',
    operationId: 'mentorByIdDelete',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'mentorId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add evaluatorId to delete single mentor detail",
        }
    ],
    responses: {
        '200': {
            description: 'Success',
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError,
    }
}