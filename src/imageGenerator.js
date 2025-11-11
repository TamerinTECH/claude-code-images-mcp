/**
 * Image Generator Service
 *
 * Generates images using Azure OpenAI and saves them locally
 * Optimized for Claude Code integration
 */

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import config from './config.js';

/**
 * Validate size for Flux model
 * - Min: 256x256, Max: 1440x1440
 * - Must be multiple of 32
 * - Can be different ratios
 */
function validateFluxSize(size) {
  const [width, height] = size.split('x').map(Number);

  if (!width || !height) {
    throw new Error('Size must be in WxH format (e.g., 1024x1024)');
  }

  if (width < 256 || height < 256 || width > 1440 || height > 1440) {
    throw new Error('Flux size must be between 256x256 and 1440x1440');
  }

  if (width % 32 !== 0 || height % 32 !== 0) {
    throw new Error('Flux size dimensions must be multiples of 32');
  }

  return size;
}

/**
 * Validate quality parameter based on model type
 */
function validateQuality(quality, modelType) {
  if (modelType === 'flux') {
    if (!['standard', 'hd'].includes(quality)) {
      throw new Error('Flux quality must be "standard" or "hd"');
    }
  } else if (modelType === 'gpt-image-1') {
    if (!['low', 'medium', 'high'].includes(quality)) {
      throw new Error('gpt-image-1 quality must be "low", "medium", or "high"');
    }
  }
  return quality;
}

/**
 * Convert size shorthand to pixel dimensions
 * @param {string} size - Size shorthand or WxH format
 * @param {string} modelType - Model type (flux or dalle)
 * @returns {string} Pixel dimensions in WxH format
 */
function toPixels(size, modelType = 'flux') {
  // Common shortcuts
  const sizeMap = {
    'small': '512x512',
    'medium': '1024x1024',
    'large': '1440x1440',
    'square': '1024x1024',
    'portrait': '1024x1440',
    'landscape': '1440x1024',
  };

  if (sizeMap[size]) {
    size = sizeMap[size];
  }

  // Validate format
  if (!/^\d+x\d+$/.test(size)) {
    throw new Error('Size must be a shorthand (small, medium, large, square, portrait, landscape) or WxH format (e.g., 1024x1024)');
  }

  // Validate based on model
  if (modelType === 'flux') {
    return validateFluxSize(size);
  }

  return size;
}

export class ImageGenerator {
  /**
   * Generate an image from a text prompt
   *
   * @param {string} prompt - The image generation prompt (should be detailed and descriptive)
   * @param {Object} options - Generation options
   * @param {string} options.quality - Image quality (Flux: 'standard'/'hd', gpt-image-1: 'low'/'medium'/'high')
   * @param {string} options.size - Image size (shortcuts: small/medium/large/square/portrait/landscape or WxH format)
   * @param {string} options.outputFormat - Output format ('png')
   * @param {number} options.outputCompression - Compression level (0-100)
   * @param {string} options.filename - Optional custom filename (without extension)
   * @returns {Promise<{path: string, url: string, prompt: string, modelType: string}>} Generated image info
   */
  async generateImage(prompt, {
    quality = 'standard',
    size = 'medium',
    outputFormat = 'png',
    outputCompression = 100,
    filename = null
  } = {}) {
    if (!prompt) {
      throw new Error('prompt is required');
    }

    if (prompt.length < 10) {
      throw new Error('prompt should be detailed and descriptive (at least 10 characters)');
    }

    // Validate configuration
    config.validate();

    // Detect model type
    const modelType = config.getModelType();

    // Validate quality for the specific model
    validateQuality(quality, modelType);

    // Convert and validate size
    const pixelSize = toPixels(size, modelType);

    const payload = {
      prompt,
      n: 1,
      size: pixelSize,
      output_format: outputFormat,
      quality,
      output_compression: outputCompression,
    };

    const apiUrl = config.getApiUrl();

    console.error('🎨 [Image Generation] Generating image...');
    console.error(`   Model: ${modelType} (${config.deployment})`);
    console.error(`   Size: ${pixelSize}`);
    console.error(`   Quality: ${quality}`);
    console.error(`   Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);

    try {
      const { data } = await axios.post(apiUrl, payload, {
        headers: {
          'api-key': config.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 2 minute timeout
      });

      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) {
        throw new Error('No image data in response');
      }

      console.error('✅ [Image Generation] Image generated successfully');

      // Save to local file
      const filePath = await this.saveBase64Image(b64, outputFormat, filename);
      console.error(`💾 [Image Generation] Image saved to: ${filePath}`);

      return {
        path: filePath,
        url: `file://${filePath}`,
        prompt: prompt,
        size: pixelSize,
        quality,
        modelType
      };
    } catch (error) {
      console.error('❌ [Image Generation] Failed to generate image:');
      console.error('   Status:', error.response?.status);
      console.error('   Message:', error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Generate a UI/app screenshot-style image
   *
   * @param {Object} params - UI generation parameters
   * @param {string} params.description - Detailed description of the UI/app to generate
   * @param {string} params.style - UI style (modern, minimal, professional, playful, etc.)
   * @param {string} params.type - Type of UI (mobile app, web app, dashboard, landing page, etc.)
   * @param {string} params.size - Image size (default: portrait for mobile)
   * @returns {Promise<{path: string, url: string, prompt: string}>} Generated image info
   */
  async generateUIImage({ description, style = 'modern', type = 'web app', size = 'portrait' }) {
    if (!description) {
      throw new Error('description is required for UI generation');
    }

    if (description.length < 20) {
      throw new Error('description should be detailed (at least 20 characters) to generate a quality UI mockup');
    }

    const prompt = this.buildUIPrompt(description, style, type);

    console.error(`🖥️ [Image Generation] Generating ${type} UI...`);

    return await this.generateImage(prompt, {
      quality: 'standard',
      size,
      outputFormat: 'png',
      outputCompression: 100,
    });
  }

  /**
   * Build a prompt optimized for UI/app screenshot generation
   *
   * @param {string} description - UI description
   * @param {string} style - Visual style
   * @param {string} type - Type of UI
   * @returns {string} Optimized prompt
   */
  buildUIPrompt(description, style, type) {
    const styleDescriptions = {
      modern: 'sleek, contemporary design with clean lines and vibrant colors',
      minimal: 'minimalist design with lots of white space and subtle colors',
      professional: 'professional corporate design with business-appropriate colors',
      playful: 'playful and colorful design with fun elements and bright colors',
      dark: 'dark mode interface with dark background and accent colors',
      glassmorphism: 'glassmorphism design with frosted glass effects and transparency'
    };

    const typeDescriptions = {
      'mobile app': 'mobile application interface with typical mobile UI patterns',
      'web app': 'web application interface with desktop layout',
      'dashboard': 'analytics dashboard with charts, graphs, and data visualizations',
      'landing page': 'marketing landing page with hero section and call-to-action',
      'e-commerce': 'e-commerce product page or shopping interface',
      'social media': 'social media feed or profile interface'
    };

    let prompt = `A high-quality UI design screenshot of a ${type}. `;
    prompt += `${description}. `;

    if (styleDescriptions[style]) {
      prompt += `The design features a ${styleDescriptions[style]}. `;
    }

    if (typeDescriptions[type]) {
      prompt += `This is a ${typeDescriptions[type]}. `;
    }

    prompt += 'The interface should be pixel-perfect with proper spacing, typography, and visual hierarchy. ';
    prompt += 'Include realistic UI elements like buttons, input fields, navigation, icons, and content. ';
    prompt += 'Professional UI/UX design quality with attention to detail. ';
    prompt += 'Sharp, crisp rendering suitable for presentation or mockup. ';
    prompt += 'NO code, NO Lorem Ipsum placeholder text, use realistic content. ';
    prompt += 'NO watermarks or labels.';

    return prompt;
  }

  /**
   * Save a base64 image to local filesystem
   *
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} format - Image format (png, jpg)
   * @param {string} customFilename - Optional custom filename
   * @returns {Promise<string>} Absolute path to saved file
   */
  async saveBase64Image(base64Data, format = 'png', customFilename = null) {
    // Ensure output directory exists
    await fs.mkdir(config.outputDir, { recursive: true });

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = customFilename
      ? `${customFilename}.${format}`
      : `image-${timestamp}.${format}`;

    const filePath = path.join(config.outputDir, filename);

    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);

    return filePath;
  }

  /**
   * List all generated images in the output directory
   *
   * @returns {Promise<Array<{name: string, path: string, size: number, created: Date}>>}
   */
  async listGeneratedImages() {
    try {
      await fs.mkdir(config.outputDir, { recursive: true });
      const files = await fs.readdir(config.outputDir);

      const imageFiles = await Promise.all(
        files
          .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
          .map(async (filename) => {
            const filePath = path.join(config.outputDir, filename);
            const stats = await fs.stat(filePath);
            return {
              name: filename,
              path: filePath,
              size: stats.size,
              created: stats.birthtime
            };
          })
      );

      return imageFiles.sort((a, b) => b.created - a.created);
    } catch (error) {
      console.error('Failed to list images:', error);
      return [];
    }
  }
}

export default new ImageGenerator();
