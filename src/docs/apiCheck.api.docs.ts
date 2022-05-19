const healthCheck = {
    tags: ['HealthCheck'],
    description: 'Endpoint checks the server running time and database connectivity',
    operationId: 'healthChecker',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            "uptime": 13.9573812,
                            "message": "OK",
                            "DatabaseStatus": "Active",
                            "timestamp": 1652956210898
                        }
                    }
                }
            }
        },
    }
};

export default healthCheck;