 /**
  * Represents the result of a service operation.
  *
  * Successful operations may optionally return data, while failed operations
  * return a collection of field or operation-specific errors.
  */
 export type ServiceResult<T = void> =
 | {
    success: true;
    data?: T;
   }
 | {
    success: false;
    errors: Record<string, string>;
   };