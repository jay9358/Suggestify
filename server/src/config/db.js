import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  // In serverless environments, reuse existing connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options for serverless environments
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit in serverless - let the function handle the error
    if (process.env.VERCEL || process.env.VERCEL_ENV) {
      throw error;
    }
    process.exit(1);
  }
};

export default connectDB;

