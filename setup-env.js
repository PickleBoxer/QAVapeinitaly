// @ts-check
/**
 * Helper script to manage environment variables for Playwright tests
 * 
 * This script helps setup environment variables for local development
 * and ensures the .env.example file is up to date.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE = path.join(__dirname, '.env');
const ENV_EXAMPLE_FILE = path.join(__dirname, '.env.example');

// Load environment variables from .env file
dotenv.config({ path: ENV_FILE });

/**
 * Verifies if the .env file exists, otherwise creates one from .env.example
 */
function setupEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    if (fs.existsSync(ENV_EXAMPLE_FILE)) {
      console.log('❌ No .env file found');
      console.log('✅ Creating .env file from .env.example');
      fs.copyFileSync(ENV_EXAMPLE_FILE, ENV_FILE);
      console.log('✅ Please update the .env file with your credentials');
    } else {
      console.error('❌ No .env.example file found to create .env from');
      process.exit(1);
    }
  } else {
    console.log('✅ .env file found');
  }
}

/**
 * Checks if all required variables are set in the .env file
 */
function checkRequiredVariables() {
  const requiredVars = ['TEST_USER_EMAIL', 'TEST_USER_PASSWORD'];
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please update your .env file with these variables');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

// Run setup
console.log('🔧 Setting up environment for Playwright tests');
setupEnvFile();
checkRequiredVariables();
console.log('✅ Environment setup complete');
