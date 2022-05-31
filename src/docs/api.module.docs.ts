import { conflictError, badRequestError, unauthorizedError, methodNotAllowedError, notAcceptable } from "./errors";

export const createModuleRequestBody = {
    type: 'object',
    properties: {
        course_id: {
            type: 'string',
            example: '126546654695',
        },
        description: {
            type: 'string',
            example: "Voluptas recusandae quo ut et est. Enim quibusdam et veniam nostrum est dolor reiciendis et. Delectus officiis impedit facilis assumenda dolor quia facere. Eos temporibus autem beatae eos repellat et voluptas."
        }
    }
};
export const moduleUpdatesRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};

export const createModule = {
    tags: ['Modules'],
    description: 'Endpoint for creating new module category',
    operationId: 'createModule',
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
                    $ref: '#/components/schemas/createModuleRequestBody'
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
                            id: {
                                type: 'number',
                                example: "1"
                            },
                            course_id: {
                                type: 'string',
                                example: "126546654695"
                            },
                            description: {
                                type: 'string',
                                example: "Voluptas recusandae quo ut et est. Enim quibusdam et veniam nostrum est dolor reiciendis et. Delectus officiis impedit facilis assumenda dolor quia facere. Eos temporibus autem beatae eos repellat et voluptas"
                            },
                            updatedAt: {
                                type: 'string',
                                example: "2022-05-20T11:13:02.094Z"
                            },
                            createdAt: {
                                type: 'string',
                                example: "2022-05-20T11:13:02.094Z"
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
export const moduleList = {
    tags: ['Modules'],
    description: 'Get the list of the module',
    operationId: 'modulesList',
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
                                example: [
                                    {
                                        "id": 1,
                                        "course_id": "126546654695",
                                        "description": "Voluptas recusandae quo ut et est. Enim quibusdam et veniam nostrum est dolor reiciendis et. Delectus officiis impedit facilis assumenda dolor quia facere. Eos temporibus autem beatae eos repellat et voluptas.",
                                        "status": null,
                                        "createdAt": "2022-05-20T11:13:02.000Z",
                                        "updatedAt": "2022-05-20T11:13:02.000Z"
                                    }
                                ]
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
export const moduleById = {
    tags: ['Modules'],
    description: 'Endpoint for getting single module',
    operationId: 'moduleById',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'moduleId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add moduleId to fetch specify module",
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
                                    "course_id": "126546654695",
                                    "description": "Voluptas recusandae quo ut et est. Enim quibusdam et veniam nostrum est dolor reiciendis et. Delectus officiis impedit facilis assumenda dolor quia facere. Eos temporibus autem beatae eos repellat et voluptas.",
                                    "updatedAt": "2022-05-20T11:13:02.094Z",
                                    "createdAt": "2022-05-20T11:13:02.094Z"
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
export const moduleByIdUpdate = {
    tags: ['Modules'],
    description: 'Endpoint for updating the specific module',
    operationId: 'moduleByIdUpdate',
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
                    $ref: '#/components/schemas/moduleUpdatesRequestBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'moduleId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add moduleId to update specify module",
        }
    ],
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
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
export const moduleByIdDelete = {
    tags: ['Modules'],
    description: 'Endpoint for removing a single module category',
    operationId: 'moduleByIdDelete',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'moduleId',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "moduleId to fetch",
        }
    ],
    responses: {
        '202': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            deletedModule: {
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