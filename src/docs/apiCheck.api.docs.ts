const healthCheck = {
    tags: ['HealthCheck'],
    description: 'check the server is running, return object with message',
    operationId: 'healthChecker',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'Server is up and running',  
        }
    },
};

export default healthCheck;