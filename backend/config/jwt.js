import jwt from 'jsonwebtoken';

// Use JWT_SECRET from env; in production require it, otherwise fall back to a dev default
let JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`❌ CRITICAL: JWT_SECRET environment variable is not set!
JWT authentication cannot function without a secret.
Please set JWT_SECRET in your .env file or environment variables.
Generate a strong secret using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`);
  } else {
    console.warn('⚠️ WARNING: JWT_SECRET not set. Using development default (DO NOT USE IN PRODUCTION).');
    JWT_SECRET = 'default-dev-secret-DO-NOT-USE-IN-PRODUCTION';
  }
}

// Validate JWT_SECRET strength in production
if (process.env.NODE_ENV === 'production') {
  if (JWT_SECRET.length < 32) {
    throw new Error(`❌ CRITICAL: JWT_SECRET is too short for production use!
Production JWT_SECRET must be at least 32 characters long.
Current length: ${JWT_SECRET.length}
Generate a strong secret using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`);
  }
  
  // Warn about common weak secrets
  const weakSecrets = [
    'YOUR_REAL_JWT_SECRET_CHANGE_THIS_IN_PRODUCTION',
    'default-secret-change-in-production',
    'change-this-in-production',
    'secret',
    'jwt-secret',
    'your-secret-key'
  ];
  
  if (weakSecrets.some(weak => JWT_SECRET.toLowerCase().includes(weak.toLowerCase()))) {
    throw new Error(
      '❌ CRITICAL: JWT_SECRET appears to be using a default/weak value!\n' +
      'This is extremely dangerous in production. Please generate a strong, unique secret.'
    );
  }
}

const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyToken };
