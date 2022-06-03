import { conflictError, badRequestError, unauthorizedError, methodNotAllowedError, notAcceptable } from "./errors";

export const createVideosRequestBody = {
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
export const videosUpdatesRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};
export const createVideos = {
    tags: ['Videos'],
    description: 'Endpoint for creating new video category',
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
                    $ref: '#/components/schemas/createVideosRequestBody'
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
                                type: 'number',
                                example: '4'
                            },
                            module: {
                                type: 'string',
                                example: '2'
                            },
                            videos_id: {
                                type: 'string',
                                example: '12654246654695'
                            },
                            status: {
                                type: 'string',
                                example: 'Completed'
                            },
                            updatedAt: {
                                type: 'string',
                                example: '2022-06-02T17:12:32.882Z'
                            },
                            createdAt: {
                                type: 'string',
                                example: '2022-06-02T17:12:32.882Z'
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
export const videosList = {
    tags: ['Videos'],
    description: 'Endpoint for getting list of videos created',
    operationId: 'videosList',
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
                                        "id": 4,
                                        "videos_name": "javascript videos",
                                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inde sermone vario sex illa ersem captum adduceret, eodem flumine invectio? Itaque hic ipse iam pridem est reiectus; Duo Reges: constructio interrete. Primum in nostrane potestate est",
                                        "status": "Incomplete",
                                        "createdAt": "2022-04-21T13:25:24.000Z",
                                        "updatedAt": "2022-04-29T04:08:18.000Z"
                                    },
                                    {
                                        "id": 5,
                                        "videos_name": "python",
                                        "description": "Eum accusantium sunt vel. Animi dolorem vero quo. Voluptatem voluptates ex quo. Nemo exercitationem consequatur provident et labore ut. Itaque commodi aliquid enim.",
                                        "status": "Completed",
                                        "createdAt": "2022-05-06T10:52:05.000Z",
                                        "updatedAt": "2022-05-06T10:52:05.000Z"
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
export const videosById = {
    tags: ['Videos'],
    description: 'Endpoint for getting single videos',
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
                default: 1
            },
            required: true,
            description: "Add videosId to fetch specify videos ",
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
                                    "id": 4,
                                    "videos_name": "javascript videos",
                                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inde sermone vario sex illa ersem captum adduceret, eodem flumine invectio? Itaque hic ipse iam pridem est reiectus; Duo Reges: constructio interrete. Primum in nostrane potestate est",
                                    "status": "Incomplete",
                                    "createdAt": "2022-04-21T13:25:24.000Z",
                                    "updatedAt": "2022-04-29T04:08:18.000Z"
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
export const videosByIdUpdate = {
    tags: ['Videos'],
    description: 'Endpoint for updating the specific video',
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
                    $ref: '#/components/schemas/videosUpdatesRequestBody'
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
                default: 1
            },
            required: true,
            description: "Add videosId to update specify videos",
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
export const videosByIdDelete = {
    tags: ['Videos'],
    description: 'Endpoint for removing a single video category',
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
                default: 1
            },
            required: true,
            description: "Add evaluatorId to delete single video details"
        }
    ],
    responses: {
        '202': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            deletedVideo: {
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