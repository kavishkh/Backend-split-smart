import { MongoClient } from 'mongodb';

// Force the correct MongoDB configuration - OVERRIDE any environment variables
console.log('🔧 FORCING MongoDB configuration...');
console.log('🔧 Original MONGODB_URI from environment:', process.env.MONGODB_URI);
console.log('🔧 Original DATABASE_NAME from environment:', process.env.DATABASE_NAME);

// FORCE the correct MongoDB URI - This is the definitive fix
const MONGODB_URI = 'mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0';
const DATABASE_NAME = 'splitwiseApp';

console.log('✅ FORCED MONGODB_URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@'));
console.log('✅ FORCED DATABASE_NAME:', DATABASE_NAME);

let client;
let db;
let changeStreams = {};
let isDatabaseConnected = false;
let connectionRetryCount = 0;
const MAX_RETRY_ATTEMPTS = 3; // Reduce retries to fail faster

const connectDatabase = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('🔍 MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@'));
    console.log('🔍 Database Name:', DATABASE_NAME);
    
    // Create MongoDB client with proper options
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Shorter timeout
      connectTimeoutMS: 10000,
      retryWrites: true,
      maxPoolSize: 5,
      minPoolSize: 1
    });
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ MongoDB Connected Successfully!');
    isDatabaseConnected = true;
    connectionRetryCount = 0;
    
    // Set the database
    db = client.db(DATABASE_NAME);
    
    // Test the connection
    const collections = await db.listCollections().toArray();
    console.log(`📁 Database: ${DATABASE_NAME}`);
    console.log(`📋 Collections: ${collections.map(c => c.name).join(', ') || 'None'}`);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection FAILED:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    
    // Specific error handling for authentication failures
    if (error.message.includes('bad auth') || error.code === 8000) {
      console.error('🔐 CRITICAL AUTHENTICATION ERROR!');
      console.error('   Possible causes:');
      console.error('   1. ❌ WRONG USERNAME: Should be "kavishkhanna06_db_user"');
      console.error('   2. ❌ WRONG PASSWORD: Should be "kavish123"');
      console.error('   3. ❌ WRONG CLUSTER: Should be "cluster0.wv2snu3.mongodb.net"');
      console.error('   4. ❌ USER DOES NOT EXIST in MongoDB Atlas');
      console.error('   5. ❌ IP NOT WHITELISTED in MongoDB Atlas');
      console.error('');
      console.error('   🔧 SOLUTIONS:');
      console.error('   ✅ Verify user exists in MongoDB Atlas Database Access');
      console.error('   ✅ Check password is exactly "kavish123"');
      console.error('   ✅ Ensure IP whitelist includes 0.0.0.0/0');
      console.error('   ✅ Confirm cluster name is "cluster0.wv2snu3.mongodb.net"');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 DNS lookup failed. Check your MongoDB URI cluster name.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('🔌 Connection refused. MongoDB server may be down.');
    }
    
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    isDatabaseConnected = false;
    
    return null;
  }
};

const getDatabase = () => db;

const isDatabaseAvailable = () => isDatabaseConnected;

const closeDatabase = async () => {
  try {
    if (client) {
      await client.close();
      console.log('🔒 MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
  isDatabaseConnected = false;
  connectionRetryCount = 0;
};

// Export with forced configuration
export { connectDatabase, getDatabase, closeDatabase, isDatabaseAvailable };