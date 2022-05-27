import HttpStatus from 'http-status-codes';

/**
 * Build error response for validation errors.
 *
 * @param   {Error} err
 * @returns {Object}
 */
function buildResponse(dataValue) {
    return {
        code: HttpStatus.OK,
        message: HttpStatus.getStatusText(HttpStatus.OK),
        data: dataValue
    }
}

export default buildResponse;