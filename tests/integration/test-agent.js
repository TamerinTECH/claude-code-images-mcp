#!/usr/bin/env node

/**
 * Integration test for Claude Code Image Generation Agent
 *
 * Tests the agent with real Azure OpenAI API calls
 * Requires valid Azure OpenAI credentials in environment variables
 */

import imageGenerator from '../../src/imageGenerator.js';
import config from '../../src/config.js';

console.log('🧪 Claude Code Image Generation Agent - Integration Tests\n');

// Color codes for console output
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

let passedTests = 0;
let failedTests = 0;

/**
 * Test helper function
 */
async function test(name, fn) {
  process.stdout.write(`${BLUE}▶${RESET} ${name}... `);
  try {
    await fn();
    console.log(`${GREEN}✓ PASS${RESET}`);
    passedTests++;
  } catch (error) {
    console.log(`${RED}✗ FAIL${RESET}`);
    console.error(`  ${RED}Error: ${error.message}${RESET}`);
    if (process.env.VERBOSE) {
      console.error(error.stack);
    }
    failedTests++;
  }
}

/**
 * Test configuration
 */
async function testConfiguration() {
  console.log(`${YELLOW}Configuration Tests${RESET}`);
  console.log('─'.repeat(50));

  await test('Environment variables should be loaded', () => {
    if (!config.endpoint || !config.apiKey) {
      throw new Error('Missing required environment variables');
    }
  });

  await test('Configuration should validate successfully', () => {
    config.validate();
  });

  await test('Model type should be detected', () => {
    const modelType = config.getModelType();
    if (!['flux', 'gpt-image-1'].includes(modelType)) {
      throw new Error(`Invalid model type: ${modelType}`);
    }
    console.log(`\n  Model type detected: ${modelType}`);
  });

  await test('API URL should be constructed correctly', () => {
    const url = config.getApiUrl();
    if (!url.includes('openai/deployments') || !url.includes('images/generations')) {
      throw new Error(`Invalid API URL: ${url}`);
    }
  });

  console.log('');
}

/**
 * Test basic image generation (with mock or real API)
 */
async function testImageGeneration() {
  console.log(`${YELLOW}Image Generation Tests${RESET}`);
  console.log('─'.repeat(50));

  // Test validation without API call
  await test('Should reject empty prompt', async () => {
    try {
      await imageGenerator.generateImage('');
      throw new Error('Should have thrown error for empty prompt');
    } catch (error) {
      if (!error.message.includes('prompt is required')) {
        throw error;
      }
    }
  });

  await test('Should reject short prompt', async () => {
    try {
      await imageGenerator.generateImage('hi');
      throw new Error('Should have thrown error for short prompt');
    } catch (error) {
      if (!error.message.includes('should be detailed')) {
        throw error;
      }
    }
  });

  // Only run actual API tests if explicitly requested
  if (process.env.RUN_API_TESTS === 'true') {
    console.log(`\n${YELLOW}⚠ Running live API tests - this will use your Azure OpenAI quota${RESET}\n`);

    await test('Should generate image with valid prompt', async () => {
      const result = await imageGenerator.generateImage(
        'A simple red circle on a white background',
        {
          size: 'small',
          quality: 'standard',
        }
      );

      if (!result.path || !result.url) {
        throw new Error('Missing image path or URL in result');
      }

      console.log(`\n  Generated image: ${result.path}`);
    });

    await test('Should generate UI mockup', async () => {
      const result = await imageGenerator.generateUIImage({
        description: 'A simple login page with email and password fields and a blue login button',
        style: 'modern',
        type: 'web app',
        size: 'small',
      });

      if (!result.path || !result.url) {
        throw new Error('Missing image path or URL in result');
      }

      console.log(`\n  Generated UI mockup: ${result.path}`);
    });
  } else {
    console.log(`\n${BLUE}ℹ Skipping live API tests. Set RUN_API_TESTS=true to run them.${RESET}\n`);
  }

  console.log('');
}

/**
 * Test utility functions
 */
async function testUtilities() {
  console.log(`${YELLOW}Utility Tests${RESET}`);
  console.log('─'.repeat(50));

  await test('Should list generated images', async () => {
    const images = await imageGenerator.listGeneratedImages();
    if (!Array.isArray(images)) {
      throw new Error('listGeneratedImages should return an array');
    }
    console.log(`\n  Found ${images.length} generated image(s)`);
  });

  await test('Should build UI prompt correctly', () => {
    const prompt = imageGenerator.buildUIPrompt(
      'A dashboard with charts',
      'modern',
      'dashboard'
    );

    if (!prompt.includes('dashboard')) {
      throw new Error('Prompt should include description');
    }
    if (!prompt.includes('sleek, contemporary design')) {
      throw new Error('Prompt should include style');
    }
  });

  console.log('');
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`Starting integration tests at ${new Date().toISOString()}\n`);

  try {
    await testConfiguration();
    await testImageGeneration();
    await testUtilities();
  } catch (error) {
    console.error(`\n${RED}Fatal error during tests:${RESET}`, error);
    process.exit(1);
  }

  // Print summary
  console.log('═'.repeat(50));
  console.log(`${YELLOW}Test Summary${RESET}`);
  console.log('═'.repeat(50));
  console.log(`${GREEN}Passed: ${passedTests}${RESET}`);
  console.log(`${RED}Failed: ${failedTests}${RESET}`);
  console.log(`Total: ${passedTests + failedTests}`);
  console.log('═'.repeat(50));

  if (failedTests > 0) {
    console.log(`\n${RED}Some tests failed!${RESET}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}All tests passed!${RESET}`);
    process.exit(0);
  }
}

// Check if required environment variables are set
if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
  console.error(`${RED}Error: Missing required environment variables${RESET}`);
  console.error('Please set the following environment variables:');
  console.error('  - AZURE_OPENAI_ENDPOINT');
  console.error('  - AZURE_OPENAI_API_KEY');
  console.error('  - AZURE_OPENAI_DEPLOYMENT (optional)');
  console.error('  - AZURE_OPENAI_API_VERSION (optional)');
  console.error('\nYou can set RUN_API_TESTS=true to run live API tests.');
  process.exit(1);
}

// Run tests
runAllTests();
