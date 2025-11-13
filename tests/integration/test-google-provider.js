/**
 * Integration test for Google Gemini provider
 *
 * This test requires a valid GEMINI_API_KEY in the .env file
 * Run with: node tests/integration/test-google-provider.js
 */

import { GoogleNanaBananaProvider } from '../../src/providers/GoogleNanaBananaProvider.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function testGoogleProvider() {
  console.log('🧪 Testing Google Gemini Provider...\n');

  // Check if API key is set
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    console.error('   Please add your Google Gemini API key to test image generation');
    console.error('   Get your key at: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }

  try {
    // Create provider instance
    const provider = new GoogleNanaBananaProvider({
      apiKey: process.env.GEMINI_API_KEY,
      outputDir: path.join(__dirname, '..', '..', 'generated-images')
    });

    console.log('✅ Provider created successfully');
    console.log(`   Provider name: ${provider.getName()}`);

    // Validate configuration
    provider.validate();
    console.log('✅ Provider configuration validated\n');

    // Test 1: Generate a simple image
    console.log('📝 Test 1: Generating a simple test image...');
    const result1 = await provider.generateImage(
      'A cute cartoon robot with blue eyes and a friendly smile, simple digital art style',
      { filename: 'test-google-robot' }
    );

    console.log('✅ Image generated successfully!');
    console.log(`   Path: ${result1.path}`);
    console.log(`   Size: ${result1.size}`);
    console.log(`   Provider: ${result1.provider}`);
    console.log(`   MIME type: ${result1.mimeType}\n`);

    // Test 2: Generate with working directory
    console.log('📝 Test 2: Generating with working directory...');
    const result2 = await provider.generateImage(
      'A colorful geometric pattern with circles and triangles, modern abstract art',
      {
        filename: 'test-google-pattern',
        workingDirectory: process.cwd()
      }
    );

    console.log('✅ Image generated with working directory!');
    console.log(`   Path: ${result2.path}`);
    console.log(`   Base64 length: ${result2.base64.length} characters\n`);

    console.log('🎉 All tests passed!');
    console.log(`\n✅ Generated ${2} test images successfully`);

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error(`   Error: ${error.message}`);
    if (error.stack) {
      console.error(`\nStack trace:\n${error.stack}`);
    }
    process.exit(1);
  }
}

// Run the test
testGoogleProvider().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
