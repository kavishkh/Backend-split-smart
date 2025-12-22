import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using the default SMTP transport
const createTransporter = () => {
  // Check if we should use real emails
  const useRealEmails = process.env.USE_REAL_EMAILS === 'true';
  
  // If not using real emails, return mock transporter immediately
  if (!useRealEmails) {
    console.log('📧 Using mock email transporter (real emails disabled)');
    return createMockTransporter();
  }
  
  // Only proceed with real transporter if explicitly enabled
  try {
    // Check if we have email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email credentials not found. Falling back to mock mode.');
      return createMockTransporter();
    }

    // Safe Gmail configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Verify SMTP connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error);
      } else {
        console.log('✅ SMTP connection verified successfully');
      }
    });
    
    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    console.warn('⚠️  Falling back to mock mode.');
    return createMockTransporter();
  }
};

// Create a mock transporter for development/testing
const createMockTransporter = () => {
  return {
    sendMail: async (mailOptions) => {
      console.log('📧 [MOCK EMAIL - DEVELOPMENT MODE]');
      console.log('   From:', mailOptions.from);
      console.log('   To:', mailOptions.to);
      console.log('   Subject:', mailOptions.subject);
      console.log('   Text:', mailOptions.text ? mailOptions.text.substring(0, 100) + '...' : 'None');
      console.log('   HTML:', mailOptions.html ? mailOptions.html.substring(0, 100) + '...' : 'None');
      
      // Generate a mock message ID
      const messageId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        messageId: messageId,
        response: 'Mock email sent successfully'
      };
    },
    verify: (callback) => {
      // Mock verification always succeeds
      if (callback) callback(null, true);
      return Promise.resolve(true);
    }
  };
};

const transporter = createTransporter();

export default transporter;