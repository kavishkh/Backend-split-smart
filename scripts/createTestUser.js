import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://noreplysplitsmart_db_user:splitsmart12@splitsmart.mnshqrq.mongodb.net/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'splitwiseApp';

async function createTestUser() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    
    // Create a test user
    const usersCollection = db.collection('users');
    
    // Check if test user already exists
    const existingUser = await usersCollection.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('⚠️ Test user already exists');
      console.log('User:', existingUser.name, '-', existingUser.email);
      return;
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);
    
    // Create test user data
    const testUser = {
      id: 'user-test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      initials: 'TU',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert the test user
    const result = await usersCollection.insertOne(testUser);
    
    if (result.insertedId) {
      console.log('✅ Test user created successfully!');
      console.log('User:', testUser.name, '-', testUser.email);
      console.log('Password: password123');
      console.log('User ID:', testUser.id);
    } else {
      console.log('❌ Failed to create test user');
    }
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('❌ MongoDB connection closed');
    }
  }
}

// Run the function
createTestUser();