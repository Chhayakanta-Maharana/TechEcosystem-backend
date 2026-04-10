import crypto from 'crypto';

export default {
  hashPassword: (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  },

  comparePassword: (password, hash) => {
    return crypto.createHash('sha256').update(password).digest('hex') === hash;
  },

  generateId: () => {
    return crypto.randomUUID();
  },

  generateToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

  getCurrentTimestamp: () => {
    return Math.floor(Date.now() / 1000);
  }
};
