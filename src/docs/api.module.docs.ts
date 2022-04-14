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

export const createModuleBody = {
    type: 'object',
    properties: {
        course_id: {
            type: 'string',
            example: '126546654695',
        },
        description: {
            type: 'string',
            example: 'Voluptas recusandae quo ut et est. Enim quibusdam et veniam nostrum est dolor reiciendis et. Delectus officiis impedit facilis assumenda dolor quia facere. Eos temporibus autem beatae eos repellat et voluptas. Commodi dignissimos dignissimos temporibus quia voluptate inventore. Et incidunt vero quia autem autem.'
        }
    }
};
export const moduleUpdatesBody = {
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
    description: 'Create a module entry',
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
                    $ref: '#/components/schemas/createModuleBody'
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
                            course_id: {
                                type: 'string'
                            },
                            description: {
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
        '202': {
            description: 'Success',
        },
        '401': unauthorizedError,
        '405': methodNotAllowedError,
        '404': badRequestError,
    }
}
export const moduleById = {
    tags: ['Modules'],
    description: 'Get the single module',
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
                default: 963258
            },
            required: true,
            description: "moduleId to fetch",
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
export const moduleByIdUpdate = {
    tags: ['Modules'],
    description: 'update a module entry',
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
                    $ref: '#/components/schemas/moduleUpdatesBody'
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
                default: 963258
            },
            required: true,
            description: "moduleId to fetch",
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
export const moduleByIdDelete = {
    tags: ['Modules'],
    description: 'delete the single entry with module id',
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
                default: 963258
            },
            required: true,
            description: "moduleId to fetch",
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