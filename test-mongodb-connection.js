import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  // Use the same URI format as your application
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0';
  const DATABASE_NAME = process.env.DATABASE_NAME || 'splitwiseApp';
  
  console.log('🧪 Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@'));
  console.log('Database:', DATABASE_NAME);
  
  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    
    console.log('🔗 Attempting to connect...');
    await client.connect();
    console.log('✅ Connection successful!');
    
    const db = client.db(DATABASE_NAME);
    const collections = await db.listCollections().toArray();
    console.log(`📁 Database '${DATABASE_NAME}' contains collections:`, collections.map(c => c.name).join(', ') || 'None');
    
    await client.close();
    console.log('🔒 Connection closed.');
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 8000 || error.message.includes('bad auth')) {
      console.error('\n🔐 AUTHENTICATION FAILED');
      console.error('Please verify:');
      console.error('1. Username and password are correct');
      console.error('2. User exists in MongoDB Atlas Database Access');
      console.error('3. Password is properly URL encoded if it contains special characters');
      console.error('4. IP address is whitelisted in MongoDB Atlas Network Access');
    }
    
    return false;
  }
};

// Run the test
testConnection().then(success => {
  console.log('\n🏁 Test completed.');
  process.exit(success ? 0 : 1);
});