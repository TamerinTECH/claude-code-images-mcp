#!/usr/bin/env node

/**
 * Integration test for Claude Code Image Generation MCP Server
 *
 * Tests the server with real provider API calls (Google Gemini or Azure OpenAI)
 * Requires valid provider credentials in environment variables
 */

import config from '../../src/config.js';
import { createImageProvider } from '../../src/providerFactory.js';

console.log('🧪 Claude Code Image Generation MCP Server - Integration Tests\n');

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

  await test('Provider should be configured', () => {
    if (!config.provider) {
      throw new Error('Provider not configured');
    }
    console.log(`\n  Provider: ${config.provider}`);
  });

  await test('Configuration should validate successfully', () => {
    config.validate();
  });

  if (config.provider === 'azure') {
    await test('Azure model type should be detected', () => {
      const modelType = config.getModelType();
      if (!['flux', 'gpt-image-1'].includes(modelType)) {
        throw new Error(`Invalid model type: ${modelType}`);
      }
      console.log(`\n  Azure model type detected: ${modelType}`);
    });

    await test('Azure API URL should be constructed correctly', () => {
      const url = config.getApiUrl();
      if (!url.includes('openai/deployments') || !url.includes('images/generations')) {
        throw new Error(`Invalid API URL: ${url}`);
      }
    });
  } else if (config.provider === 'google') {
    await test('Google API key should be present', () => {
      if (!config.geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }
    });
  }

  console.log('');
}

/**
 * Test provider creation and validation
 */
async function testProvider() {
  console.log(`${YELLOW}Provider Tests${RESET}`);
  console.log('─'.repeat(50));

  let provider;

  await test('Provider should be created successfully', () => {
    provider = createImageProvider();
    if (!provider) {
      throw new Error('Failed to create provider');
    }
    console.log(`\n  Provider name: ${provider.getName()}`);
  });

  await test('Provider should validate successfully', () => {
    provider.validate();
  });

  // Test validation without API call
  await test('Provider should reject empty prompt', async () => {
    try {
      await provider.generateImage('', {});
      throw new Error('Should have thrown error for empty prompt');
    } catch (error) {
      if (!error.message.includes('prompt is required')) {
        throw error;
      }
    }
  });

  await test('Provider should reject short prompt', async () => {
    try {
      await provider.generateImage('hi', {});
      throw new Error('Should have thrown error for short prompt');
    } catch (error) {
      if (!error.message.includes('should be detailed')) {
        throw error;
      }
    }
  });

  console.log('');
}

/**
 * Test live image generation (optional)
 */
async function testImageGeneration() {
  console.log(`${YELLOW}Image Generation Tests${RESET}`);
  console.log('─'.repeat(50));

  // Only run actual API tests if explicitly requested
  if (process.env.RUN_API_TESTS === 'true') {
    console.log(`\n${YELLOW}⚠ Running live API tests - this will use your API quota${RESET}\n`);

    const provider = createImageProvider();

    await test('Should generate image with valid prompt', async () => {
      const result = await provider.generateImage(
        'A simple red circle on a white background, minimalist design, clean digital art',
        {
          size: 'small',
          quality: 'standard',
        }
      );

      if (!result.path || !result.url) {
        throw new Error('Missing image path or URL in result');
      }

      if (!result.base64) {
        throw new Error('Missing base64 data in result');
      }

      console.log(`\n  Generated image: ${result.path}`);
      console.log(`  Provider: ${result.provider}`);
      console.log(`  Base64 length: ${result.base64.length} chars`);
    });

    await test('Should generate image with custom filename', async () => {
      const result = await provider.generateImage(
        'A blue square with rounded corners, simple geometric shape',
        {
          filename: 'test-custom-filename',
          quality: 'standard',
        }
      );

      if (!result.path.includes('test-custom-filename')) {
        throw new Error('Custom filename not used');
      }

      console.log(`\n  Generated image: ${result.path}`);
    });

  } else {
    console.log(`\n${BLUE}ℹ Skipping live API tests. Set RUN_API_TESTS=true to run them.${RESET}`);
    console.log(`${BLUE}  Example: RUN_API_TESTS=true npm run test:integration${RESET}\n`);
  }

  console.log('');
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`Starting integration tests at ${new Date().toISOString()}\n`);

  try {
    await testConfiguration();
    await testProvider();
    await testImageGeneration();
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

// Check if required environment variables are set based on provider
const provider = process.env.IMAGE_PROVIDER || 'google';

if (provider === 'google') {
  if (!process.env.GEMINI_API_KEY) {
    console.error(`${RED}Error: Missing required environment variable for Google provider${RESET}`);
    console.error('Please set: GEMINI_API_KEY');
    console.error('\nGet your API key at: https://aistudio.google.com/app/apikey');
    console.error('\nYou can set RUN_API_TESTS=true to run live API tests.');
    process.exit(1);
  }
} else if (provider === 'azure') {
  if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
    console.error(`${RED}Error: Missing required environment variables for Azure provider${RESET}`);
    console.error('Please set the following environment variables:');
    console.error('  - AZURE_OPENAI_ENDPOINT');
    console.error('  - AZURE_OPENAI_API_KEY');
    console.error('  - AZURE_OPENAI_DEPLOYMENT (optional)');
    console.error('  - AZURE_OPENAI_API_VERSION (optional)');
    console.error('\nYou can set RUN_API_TESTS=true to run live API tests.');
    process.exit(1);
  }
}

// Run tests
runAllTests();
