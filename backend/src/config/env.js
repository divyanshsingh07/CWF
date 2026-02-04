/**
 * Environment Variable Validation
 * Validates required environment variables on startup
 */

const requiredEnvVars = {
  production: [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'NODE_ENV',
  ],
  development: [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
  ],
};

const optionalEnvVars = {
  
  AWS_ACCESS_KEY_ID: null,
  AWS_SECRET_ACCESS_KEY: null,
  AWS_REGION: null,
  S3_BUCKET: null,
  CLOUDFRONT_DOMAIN: null,
};

export function validateEnv() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const missing = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\n📝 Please check your .env file\n');
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about missing optional vars
  if (env === 'production') {
    const hasS3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
    if (!hasS3) {
      console.warn('⚠️  AWS S3 credentials not found. Using local file storage.');
      console.warn('   For production, consider configuring S3/CloudFront.\n');
    }
  }

  console.log('✅ Environment variables validated');
}
