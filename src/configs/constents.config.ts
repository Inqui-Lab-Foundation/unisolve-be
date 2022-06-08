export const constents = {
    log_levels: {
      list:{
        'INFO': 'INFO', 
        'ERROR': 'ERROR', 
        'WARNING': 'WARNING', 
        'DEBUG': 'DEBUG', 
        'CRITICAL': 'CRITICAL', 
        'SUCCESS': 'SUCCESS', 
        'FAILURE': 'FAILURE', 
        'LOGIN': 'LOGIN', 
        'LOGOUT': 'LOGOUT', 
        'INBOUND': 'INBOUND', 
        'OUTBOUND': 'OUTBOUND'
    },
      default: 'INFO'
    },
    status_codes: {
      list:['200', '400', '401', '403', '404', '500'],
      default: '200'
    },
    http_methods: {
      list:{
        'GET': 'GET',
        'POST': 'POST',
        'PUT': 'PUT',
        'DELETE': 'DELETE',
        'OPTIONS': 'OPTIONS'
      },
      default: 'GET'
    },
};