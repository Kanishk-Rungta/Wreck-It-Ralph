import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Only allow fallback in development mode for local testing
// In production or if explicitly set to production, require JWT_SECRET
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '❌ CRITICAL: JWT_SECRET environment variable is required in production!\n' +
      'Please set JWT_SECRET in your environment variables.'
    );
  }
  // Development fallback - still warn but allow it for local dev
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Using default for development only!');
  console.warn('⚠️  This is NOT secure and should NEVER be used in production!');
}

// Use a weak default only in development, but require JWT_SECRET in production
const SECRET_KEY = JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'default-dev-secret-DO-NOT-USE-IN-PRODUCTION' : null);

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is required but not set');
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
