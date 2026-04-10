import jwt from 'jsonwebtoken';

const jwtSecret = process.env.jwtSecret || 'your-secret-key-change-in-production';

export default {
  sign: (payload, expiresIn = '24h') => {
    return jwt.sign(payload, jwtSecret, { expiresIn });
  },

  verify: (token) => {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  decode: (token) => {
    return jwt.decode(token);
  }
};
