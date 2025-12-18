// Test script to verify MongoDB connection with the exact same configuration as the application
import { MongoClient } from 'mongodb';

console.log('🔍 Testing MongoDB Connection with FORCED Configuration');
console.log('=====================================================');

// EXACT SAME CONFIGURATION AS USED IN THE APPLICATION
const MONGODB_URI = 'mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0';
const DATABASE_NAME = 'splitwiseApp';

console.log('🔧 Testing with URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@'));
console.log('🔧 Testing with Database:', DATABASE_NAME);

async function testConnection() {
  let client;
  
  try {
    console.log('\n🔄 Attempting to connect...');
    
    // Use the exact same MongoClient configuration as in database.js
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      maxPoolSize: 5,
      minPoolSize: 1
    });
    
    await client.connect();
    console.log('✅ SUCCESS: Connected to MongoDB!');
    
    // Test database access
    const db = client.db(DATABASE_NAME);
    const collections = await db.listCollections().toArray();
    console.log(`📁 Database '${DATABASE_NAME}' contains collections:`, collections.map(c => c.name).join(', ') || 'None');
    
    // Test a simple operation
    await db.command({ ping: 1 });
    console.log('🏓 Ping successful - database is responsive');
    
    console.log('\n🎉 ALL TESTS PASSED - MongoDB connection is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ FAILED: MongoDB connection error:', error.message);
    
    if (error.message.includes('bad auth') || error.code === 8000) {
      console.error('\n🔐 AUTHENTICATION FAILURE DETECTED');
      console.error('   This means one of these is wrong:');
      console.error('   1. Username: kavishkhanna06_db_user');
      console.error('   2. Password: kavish123');
      console.error('   3. Cluster: cluster0.wv2snu3.mongodb.net');
      console.error('   4. User does not exist in MongoDB Atlas');
      console.error('   5. IP is not whitelisted in MongoDB Atlas');
      
      console.error('\n🔧 SOLUTIONS:');
      console.error('   ✅ Verify the user exists in MongoDB Atlas Database Access');
      console.error('   ✅ Confirm password is exactly "kavish123"');
      console.error('   ✅ Ensure IP whitelist includes 0.0.0.0/0');
      console.error('   ✅ Double-check cluster name is "cluster0.wv2snu3.mongodb.net"');
    }
    
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Connection closed');
    }
  }
}

// Run the test
testConnection().then(success => {
  console.log('\n🏁 Test completed.');
  if (success) {
    console.log('✅ Your MongoDB configuration is CORRECT and should work in production.');
  } else {
    console.log('❌ Your MongoDB configuration has ISSUES that need to be fixed.');
  }
  process.exit(success ? 0 : 1);
});