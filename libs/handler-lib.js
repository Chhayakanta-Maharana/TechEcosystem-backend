// Application-level errors that should return 400 (client errors)
const CLIENT_ERROR_PATTERNS = [
  'invalid email or password',
  'email already registered',
  'required',
  'not found',
  'unauthorized',
  'already exists',
  'do not match',
];

export default function handler(lambda) {
  return async function (event, context) {
    let body, statusCode;
    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      console.log(e);
      const errMsg = (e.message || '').toLowerCase();
      const isClientError = CLIENT_ERROR_PATTERNS.some(p => errMsg.includes(p));
      statusCode = isClientError ? 400 : 500;
      body = { message: e.message, error: e.message };
    }
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  };
}