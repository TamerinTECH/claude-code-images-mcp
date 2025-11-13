import { GoogleGenAI } from '@google/genai';
import { ImageProvider } from './ImageProvider.js';
import fs from 'fs/promises';
import path from 'path';

const GEMINI_MODEL_ID = 'gemini-2.0-flash-exp';

/**
 * Google Nano Banana (Gemini 2.5 Flash Image) provider
 * Uses Google's Gemini API for image generation
 */
export class GoogleNanaBananaProvider extends ImageProvider {
  constructor(config) {
    super(config);

    if (!config.apiKey) {
      throw new Error('Missing GEMINI_API_KEY. Please set it in your environment or config.');
    }

    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.outputDir = config.outputDir || path.join(process.cwd(), 'generated-images');
  }

  getName() {
    return 'google-nano-banana';
  }

  validate() {
    if (!this.config.apiKey) {
      throw new Error('Google Gemini API key is required');
    }
  }

  /**
   * Generate an image using Google Gemini 2.5 Flash Image
   * @param {string} prompt - The text description
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated image data
   */
  async generateImage(prompt, options = {}) {
    if (!prompt) {
      throw new Error('prompt is required');
    }

    if (prompt.length < 10) {
      throw new Error('prompt should be detailed and descriptive (at least 10 characters)');
    }

    try {
      console.error('🎨 [Google Gemini] Generating image...');
      console.error(`   Model: ${GEMINI_MODEL_ID}`);
      console.error(`   Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);

      // Generate image with Gemini using models.generateImages API
      const result = await this.client.models.generateImages({
        model: GEMINI_MODEL_ID,
        prompt: prompt,
        number_of_images: 1
      });

      // Extract image from response
      if (!result.images || result.images.length === 0) {
        throw new Error('Gemini did not return any images');
      }

      const image = result.images[0];
      const imageData = image.image; // Base64 encoded image data
      const mimeType = image.mimeType || 'image/png';

      if (!imageData) {
        throw new Error('Gemini did not return image data');
      }

      console.error('✅ [Google Gemini] Image generated successfully');

      // Save the image
      const filePath = await this.saveBase64Image(
        imageData,
        mimeType.split('/')[1] || 'png',
        options.filename,
        options.workingDirectory
      );

      console.error(`💾 [Google Gemini] Image saved to: ${filePath}`);

      return {
        base64: imageData,
        mimeType: mimeType,
        path: filePath,
        url: `file://${filePath}`,
        prompt: prompt,
        size: 'auto', // Gemini determines size automatically
        quality: 'standard',
        provider: 'google-nano-banana'
      };
    } catch (error) {
      console.error('❌ [Google Gemini] Failed to generate image:');
      console.error('   Message:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }
      throw new Error(`Google Nano Banana image generation failed: ${error.message}`);
    }
  }

  /**
   * Save base64 image data to file
   * @param {string} base64Data - Base64 encoded image
   * @param {string} format - Image format (png, jpg, etc.)
   * @param {string} customFilename - Optional custom filename
   * @param {string} workingDirectory - Optional working directory
   * @returns {Promise<string>} Path to saved file
   */
  async saveBase64Image(base64Data, format = 'png', customFilename = null, workingDirectory = null) {
    // Determine output directory based on working directory if provided
    const outputDir = workingDirectory
      ? path.join(workingDirectory, 'generated-images')
      : this.outputDir;

    await fs.mkdir(outputDir, { recursive: true });

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = customFilename
      ? `${customFilename}.${format}`
      : `google-nanaban-${timestamp}-${randomStr}.${format}`;

    const filePath = path.join(outputDir, filename);

    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);

    return filePath;
  }
}
