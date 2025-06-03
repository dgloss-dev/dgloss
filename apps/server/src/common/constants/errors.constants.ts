export const ERRORS = {
  BAD_REQUEST: {
    key: 'BAD_REQUEST',
    message: 'Invalid syntax for this request was provided',
  },
  UNAUTHORIZED: {
    key: 'UNAUTHORIZED',
    message: 'You are unauthorized to access the requested resource',
  },
  INCORRECT_CREDENTIALS: {
    key: 'INCORRECT_CREDENTIALS',
    message: 'The email or password you entered is incorrect',
  },
  INVALID_USER_KEY: {
    key: 'INVALID_USER_KEY',
    message: 'The provided user key is invalid',
  },
  INVALID_REFRESH_TOKEN: {
    key: 'INVALID_REFRESH_TOKEN',
    message: 'The provided refresh token is invalid',
  },
  FORBIDDEN: {
    key: 'FORBIDDEN',
    message: 'You are not allowed to access the requested resource',
  },
  NOT_FOUND: {
    key: 'NOT_FOUND',
    message: 'We could not find the resource you requested',
  },
  CONFLICT: {
    key: 'CONFLICT',
    message:
      'The request could not be completed due to a conflict with the current state of the resource',
  },
  INTERNAL_SERVER_ERROR: {
    key: 'INTERNAL_SERVER_ERROR',
    message: 'Unexpected Internal Server Error',
  },
  INVALID_TOKEN: {
    key: 'INVALID_TOKEN',
    message: 'The provided auth token is not found or invalid',
  },
  API_NOT_FOUND: {
    key: 'API_NOT_FOUND',
    message: 'The requested API is not found',
  },
  INVALID_SCHEMA: {
    key: 'INVALID_SCHEMA',
    message: 'The provided schema is invalid',
  },
  PARAMETER_MISSING: {
    key: 'PARAMETER_MISSING',
    message: 'Required parameters are missing',
  },
  INVALID_PARAMETERS: {
    key: 'INVALID_PARAMETERS',
    message: 'The provided parameters are invalid',
  },
  INVALID_ID: {
    key: 'INVALID_ID',
    message: 'The provided resource id is invalid',
  },
  GET_FAILED: {
    key: 'GET_FAILED',
    message: 'Failed to get the requested resouces',
  },
  CREATE_FAILED: {
    key: 'CREATE_FAILED',
    message: 'Failed to create the requested resouce',
  },
  UPDATE_FAILED: {
    key: 'UPDATE_FAILED',
    message: 'Failed to update the requested resouce',
  },
  DELETE_FAILED: {
    key: 'DELETE_FAILED',
    message: 'Failed to delete the requested resouce',
  },
  ALREADY_EXISTS: {
    key: 'ALREADY_EXISTS',
    message: 'The resouce already exists',
  },
  INSUFFICIENT_BALANCE: {
    key: 'INSUFFICIENT_BALANCE',
    message: 'Insuffiecient Balance',
  },
  PAYMENT_FAILED: {
    key: 'PAYMENT_FAILED',
    message: 'The payment has not been made',
  },
  EMAIL_FAILED: {
    key: 'EMAIL_FAILED',
    message: 'The email has not been send',
  },
  SAME_PASSWORD: {
    key: 'UPDATE_PASSWORD_FAILED',
    message: 'New password cannot be the same as the current password',
  },
  USER_NOT_FOUND: {
    key: 'USER_NOT_FOUND',
    message: 'The user not found',
  },

  ALREADY_FOLLOWING: {
    key: 'USER_ALREADY_FOLLOWING',
    message: 'You are already following this creator.',
  },
  NOT_FOLLOWING: {
    key: 'USER_NOT_FOLLOWING',
    message: 'You are not following this creator.',
  },
  ALREADY_SUBSCRIBED: {
    key: 'USER_ALREADY_SUBSCRIBED',
    message: 'You are already subscribed to this creator.',
  },
  PASSWORD_RESET_REQUEST_WAITING: {
    key: 'PASSWORD_RESET_REQUEST_WAITING',
    message: 'You have already requested password reset. Please wait',
  },
  PASSWORD_RESET_EXPIRED: {
    key: 'PASSWORD_RESET_EXPIRED',
    message: 'Your password reset request has expired. Please try again.',
  },
  INVALID_PASSWORD_RESET_CODE: {
    key: 'INVALID_PASSWORD_RESET_CODE',
    message: 'The provided password reset code is invalid',
  },
};
