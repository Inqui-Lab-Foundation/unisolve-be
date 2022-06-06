import HttpStatus from 'http-status-codes';
import { unknown, ZodError } from 'zod';

/**
 * Build error response for validation errors.
 *
 * @param   {Error} err
 * @returns {Object}
 */
export default function buildError(err:any) {
  // Validation errors
  if(err instanceof ZodError){
    let error_details = "";
    if(err.issues){
      error_details = JSON.stringify(err.issues);
    }
    return {
      code: HttpStatus.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
      data:{},
      error:error_details
    };
  }
  // if (err.isJoi) {
  //   return {
  //     code: HttpStatus.BAD_REQUEST,
  //     message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
  //     data:{},
  //     error:
  //       err.details &&
  //       err.details.map(err => {
  //         return {
  //           message: err.message,
  //           param: err.path.join('.')
  //         };
  //       })
  //   };
  // }
  
  // HTTP errors
  if (err.isBoom) {
    return {
      code: err.output.statusCode,
      message: err.output.payload.message || err.output.payload.error,
      data:{},
      error:err.output.payload.message || err.output.payload.error,
    };
  }

  // Return INTERNAL_SERVER_ERROR for all other cases
  return {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
    data:{},
    error:HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
  };
}
