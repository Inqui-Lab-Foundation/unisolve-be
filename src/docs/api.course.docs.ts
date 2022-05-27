import { badRequestError, notAcceptable, unauthorizedError } from "./errors";

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

export const createCourseRequestBody = {
    type: 'object',
    properties: {
        course_name: {
            type: 'string',
            example: 'python',
        },
        description: {
            type: 'string',
            example: 'Eum accusantium sunt vel. Animi dolorem vero quo. Voluptatem voluptates ex quo.',
        },
        Thumbnail: {
            type: 'file'
        },
        status: {
            type: 'string',
            example: 'Completed'
        }
    }
};
export const courseUpdatesRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};

export const createCourse = {
    tags: ['Course'],
    description: 'Endpoint for creating new course category',
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
                    $ref: '#/components/schemas/createCourseRequestBody'
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
                                example: '1'
                            },
                            course_name: {
                                type: 'string',
                                example: 'python'
                            },
                            description: {
                                type: 'string',
                                example: 'Eum accusantium sunt vel'
                            },
                            Thumbnail: {
                                type: 'string',
                                example: "courses/Screenshot 2022-04-21 101916.png"
                            },
                            status: {
                                type: 'string',
                                example: 'Completed'
                            },
                            updatedAt: {
                                type: 'string',
                                example: '2022-05-19T07:15:49.345Z'
                            },
                            createdAt: {
                                type: 'string',
                                example: '2022-05-19T07:15:49.345Z'
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
export const courseList = {
    tags: ['Course'],
    description: 'Endpoint for getting list of courses created',
    operationId: 'CourseList',
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
                                        "course_name": "javascript Course",
                                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inde sermone vario sex illa ersem captum adduceret, eodem flumine invectio? Itaque hic ipse iam pridem est reiectus; Duo Reges: constructio interrete. Primum in nostrane potestate est",
                                        "status": "Incomplete",
                                        "createdAt": "2022-04-21T13:25:24.000Z",
                                        "updatedAt": "2022-04-29T04:08:18.000Z"
                                    },
                                    {
                                        "id": 5,
                                        "course_name": "python",
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
export const courseById = {
    tags: ['Course'],
    description: 'Endpoint for getting single course',
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
                default: 2
            },
            required: true,
            description: "Add courseId to fetch specify course",
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
                                    "course_name": "javascript Course",
                                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inde sermone vario sex illa ersem captum adduceret, eodem flumine invectio? Itaque hic ipse iam pridem est reiectus; Duo Reges: constructio interrete. Primum in nostrane potestate est",
                                    "Thumbnail": "courses/Screenshot 2022-04-21 101916.png",
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
export const courseByIdUpdate = {
    tags: ['Course'],
    description: 'Endpoint for updating the specific course',
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
                    $ref: '#/components/schemas/courseUpdatesRequestBody'
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
                default: 2
            },
            required: true,
            description: "Add courseId to update specify course",
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
export const courseByIdDelete = {
    tags: ['Course'],
    description: 'Endpoint for removing a single course category',
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
                default: 2
            },
            required: true,
            description: "Add courseId to delete specify course",
        }
    ],
    responses: {
        '202': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            deletedCourse: {
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