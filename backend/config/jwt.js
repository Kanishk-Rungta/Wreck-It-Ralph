import jwt from 'jsonwebtoken';

// Require JWT_SECRET to be set - fail fast if missing
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    '❌ CRITICAL: JWT_SECRET environment variable is not set!\n' +
    'JWT authentication cannot function without a secret.\n' +
    'Please set JWT_SECRET in your .env file or environment variables.\n' +
    'Generate a strong secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
}

// Validate JWT_SECRET strength in production
if (process.env.NODE_ENV === 'production') {
  if (JWT_SECRET.length < 32) {
    throw new Error(
      '❌ CRITICAL: JWT_SECRET is too short for production use!\n' +
      'Production JWT_SECRET must be at least 32 characters long.\n' +
      'Current length: ' + JWT_SECRET.length + '\n' +
      'Generate a strong secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
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
