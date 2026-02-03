import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Add connection options for better stability
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:', error.message);
    console.error('\n📝 Troubleshooting:');
    console.error('   1. Check if MongoDB is running locally: mongod');
    console.error('   2. For MongoDB Atlas: Check IP whitelist and credentials');
    console.error('   3. See MONGODB_SETUP.md for detailed instructions');
    console.error(`   4. Current URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')}\n`);
    
    throw error; // Re-throw to let server.js handle it
  }
};

export default connectDB;
