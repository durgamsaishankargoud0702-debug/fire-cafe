const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../seed');

let mongod = null;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/enterprise_hub';
    
    // Attempt standard connection with 3000ms server selection timeout
    try {
      console.log(`Connecting to MongoDB at: ${connUri}`);
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
      await seedData();
      return;
    } catch (localErr) {
      console.warn('⚠️ Local MongoDB connection failed or timed out. Falling back to MongoDB Memory Server...');
    }

    // Fallback: Mongo Memory Server
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`🚀 InMemory MongoDB Connected: ${conn.connection.host} (${memoryUri})`);
    
    // Seed sample data into memory DB
    await seedData();

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
