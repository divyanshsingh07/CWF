import './load-env.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import { validateEnv } from './src/config/env.js';
import authRoutes from './src/routes/auth.js';
import courseRoutes from './src/routes/course.js';
import subscriptionRoutes from './src/routes/subscription.js';
import contentRoutes from './src/routes/content.js';
import uploadRoutes from './src/routes/upload.js';
import { isS3Enabled } from './src/services/storage.js';

// Optional security packages (install with: npm install helmet express-rate-limit)
let helmet, rateLimit;
try {
  const helmetModule = await import('helmet');
  const rateLimitModule = await import('express-rate-limit');
  helmet = helmetModule.default;
  rateLimit = rateLimitModule.default;
} catch (err) {
  console.warn('⚠️  Security packages (helmet, express-rate-limit) not installed.');
  console.warn('   Install with: npm install helmet express-rate-limit');
  console.warn('   Running without security middleware...\n');
}

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Initialize Express app first
const app = express();

// Security Headers (if helmet is installed)
if (helmet) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding if needed
  }));
}

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://localhost:3000']);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.length === 0) {
      // In production, if no origins specified, deny all (security)
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('CORS: No allowed origins configured. Set ALLOWED_ORIGINS environment variable.'));
      }
      // In development, allow all if not specified
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} is not allowed. Allowed origins: ${allowedOrigins.join(', ')}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));

// Rate Limiting (if express-rate-limit is installed)
if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to all requests
  app.use('/api/', limiter);

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
  });

  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  app.use('/api/auth/signup', authLimiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database (async)
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  console.log('\n⚠️  Starting server WITHOUT database connection');
  console.log('📝 Check MONGODB_SETUP.md for setup instructions\n');
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (with /api/ prefix - used by frontend)
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

// Alias routes (without /api/ prefix - matching spec)
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/subscribe', subscriptionRoutes);

// GET /my-courses - spec route (forwards to subscription my-courses)
import { protect } from './src/middleware/auth.js';
import Subscription from './src/models/Subscription.js';

app.get('/my-courses', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const subscriptions = await Subscription.getUserSubscriptions(userId);
    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching subscriptions',
    });
  }
});

// Health check endpoint (for monitoring/load balancers)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    storage: isS3Enabled() ? 'S3 + CloudFront' : 'local',
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running...',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      subscribe: '/api/subscribe',
      content: '/api/content',
      upload: '/api/upload',
      health: '/health',
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Don't expose stack traces in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(isDevelopment && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 4000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Storage: ${isS3Enabled() ? 'S3 + CloudFront' : 'local (uploads/)'}`);
  console.log(`CORS allowed origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'All (development mode)'}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('unhandledRejection');
});
