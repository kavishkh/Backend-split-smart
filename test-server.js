import axios from 'axios';

async function testServer() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:3000/api/health');
    console.log('Server response:', response.data);
  } catch (error) {
    console.error('Error connecting to server:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testServer();