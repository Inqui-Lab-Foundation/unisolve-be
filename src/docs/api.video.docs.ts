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

export const createVideosBody = {
    type: 'object',
    properties: {
        module: {
            type: 'string',
            example: '1',
        },
        video_id: {
            type: 'string',
            example: '126546654695',
        },
        status: {
            type: 'string',
            example: "Completed"
        }
    }
};
export const videosUpdatesBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};

export const createVideos = {
    tags: ['videos'],
    description: 'Create a videos entry',
    operationId: 'createVideos',
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
                    $ref: '#/components/schemas/createVideosBody'
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
                            videos_id: {
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
export const videosList = {
    tags: ['videos'],
    description: 'Get the list of the videos',
    operationId: 'videosList',
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
export const videosById = {
    tags: ['videos'],
    description: 'Get the single videos',
    operationId: 'videosById',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'videosId',
            schema: {
                type: 'integer',
                default: 963258
            },
            required: true,
            description: "videosId to fetch",
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
export const videosByIdUpdate = {
    tags: ['videos'],
    description: 'update a videos entry',
    operationId: 'videosByIdUpdate',
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
                    $ref: '#/components/schemas/videosUpdatesBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'videosId',
            schema: {
                type: 'integer',
                default: 963258
            },
            required: true,
            description: "videosId to fetch",
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
export const videosByIdDelete = {
    tags: ['videos'],
    description: 'delete the single entry with videos id',
    operationId: 'videosByIdDelete',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'videosId',
            schema: {
                type: 'integer',
                default: 963258
            },
            required: true,
            description: "videosId to fetch",
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