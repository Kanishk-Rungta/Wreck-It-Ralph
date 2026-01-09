import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import goalRoutes from './routes/goalRoutes.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Verify required environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not set in .env file');
  console.error('Please create a .env file in the backend directory with MONGODB_URI');
  process.exit(1);
}

// Enforce JWT_SECRET requirement - fail fast if missing
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL ERROR: JWT_SECRET environment variable is not set!');
  console.error('JWT authentication cannot function without a secret.');
  console.error('Please set JWT_SECRET in your .env file or environment variables.');
  console.error('');
  console.error('To generate a strong secret, run:');
  console.error('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

// Validate JWT_SECRET strength in production
if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET is too short for production use!');
    console.error('Production JWT_SECRET must be at least 32 characters long.');
    console.error('Current length:', process.env.JWT_SECRET.length);
    process.exit(1);
  }
  
  // Check for common weak/default secrets
  const weakSecrets = [
    'YOUR_REAL_JWT_SECRET_CHANGE_THIS_IN_PRODUCTION',
    'default-secret-change-in-production',
    'change-this-in-production',
    'secret',
    'jwt-secret',
    'your-secret-key',
    'YOUR_REAL_JWT_SECRET'
  ];
  
  if (weakSecrets.some(weak => process.env.JWT_SECRET.toLowerCase().includes(weak.toLowerCase()))) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET appears to be using a default/weak value!');
    console.error('This is extremely dangerous in production. Please generate a strong, unique secret.');
    process.exit(1);
  }
  
  console.log('✅ JWT_SECRET is set and validated for production');
}

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});
