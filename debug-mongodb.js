// Debug script to test MongoDB connection with the same configuration as the application
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Debug Script: Testing MongoDB Configuration');
console.log('=============================================');

// Load environment variables exactly like server.js does
console.log('🔍 Loading environment variables...');
const envPath = path.resolve(__dirname, '../.env');
console.log('🔍 Looking for .env file at:', envPath);

try {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.log('⚠️  Could not load .env file:', result.error.message);
  } else {
    console.log('✅ Loaded .env file successfully');
  }
} catch (error) {
  console.log('⚠️  Error loading .env file:', error.message);
}

// Log all environment variables
console.log('\n🔍 All Environment Variables:');
for (const [key, value] of Object.entries(process.env)) {
  if (key.includes('MONGO') || key.includes('DB') || key.includes('URI')) {
    console.log(`   ${key}: ${value ? '[VALUE SET]' : '[NOT SET]'}`);
  }
}

// Show the MongoDB configuration
console.log('\n🔍 MongoDB Configuration:');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'splitwiseApp';

console.log('   MONGODB_URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@'));
console.log('   DATABASE_NAME:', DATABASE_NAME);

console.log('\n✅ Debug script completed.');