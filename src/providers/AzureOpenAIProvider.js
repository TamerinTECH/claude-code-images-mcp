import axios from 'axios';
import { ImageProvider } from './ImageProvider.js';
import fs from 'fs/promises';
import path from 'path';

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
 */
function toPixels(size, modelType = 'flux') {
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

  if (!/^\d+x\d+$/.test(size)) {
    throw new Error('Size must be a shorthand (small, medium, large, square, portrait, landscape) or WxH format (e.g., 1024x1024)');
  }

  if (modelType === 'flux') {
    return validateFluxSize(size);
  }

  return size;
}

/**
 * Azure OpenAI provider for Flux and gpt-image-1 models
 */
export class AzureOpenAIProvider extends ImageProvider {
  constructor(config) {
    super(config);

    if (!config.endpoint || !config.apiKey || !config.deployment || !config.apiVersion) {
      throw new Error('Azure OpenAI configuration is incomplete');
    }

    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.deployment = config.deployment;
    this.apiVersion = config.apiVersion;
    this.outputDir = config.outputDir || path.join(process.cwd(), 'generated-images');

    // Detect model type from deployment name
    this.modelType = this.getModelType();
  }

  getName() {
    return 'azure-openai';
  }

  validate() {
    if (!this.endpoint) throw new Error('Azure OpenAI endpoint is required');
    if (!this.apiKey) throw new Error('Azure OpenAI API key is required');
    if (!this.deployment) throw new Error('Azure OpenAI deployment is required');
    if (!this.apiVersion) throw new Error('Azure OpenAI API version is required');
  }

  getModelType() {
    const deploymentLower = this.deployment.toLowerCase();
    if (deploymentLower.includes('flux')) {
      return 'flux';
    } else if (deploymentLower.includes('gpt-image')) {
      return 'gpt-image-1';
    }
    // Default to flux if can't determine
    return 'flux';
  }

  getApiUrl() {
    return `${this.endpoint}/openai/deployments/${this.deployment}/images/generations?api-version=${this.apiVersion}`;
  }

  async generateImage(prompt, options = {}) {
    const {
      quality = 'standard',
      size = 'medium',
      outputFormat = 'png',
      outputCompression = 100,
      filename = null,
      workingDirectory = null
    } = options;

    if (!prompt) {
      throw new Error('prompt is required');
    }

    if (prompt.length < 10) {
      throw new Error('prompt should be detailed and descriptive (at least 10 characters)');
    }

    // Validate quality for the specific model
    validateQuality(quality, this.modelType);

    // Convert and validate size
    const pixelSize = toPixels(size, this.modelType);

    const payload = {
      prompt,
      n: 1,
      size: pixelSize,
      output_format: outputFormat,
      quality,
      output_compression: outputCompression,
    };

    const apiUrl = this.getApiUrl();

    console.error('🎨 [Image Generation] Generating image...');
    console.error(`   Model: ${this.modelType} (${this.deployment})`);
    console.error(`   Size: ${pixelSize}`);
    console.error(`   Quality: ${quality}`);
    console.error(`   Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);

    try {
      const { data } = await axios.post(apiUrl, payload, {
        headers: {
          'api-key': this.apiKey,
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
      const filePath = await this.saveBase64Image(b64, outputFormat, filename, workingDirectory);
      console.error(`💾 [Image Generation] Image saved to: ${filePath}`);

      return {
        path: filePath,
        url: `file://${filePath}`,
        base64: b64,
        prompt: prompt,
        size: pixelSize,
        quality,
        provider: 'azure-openai',
        modelType: this.modelType
      };
    } catch (error) {
      console.error('❌ [Image Generation] Failed to generate image:');
      console.error('   Status:', error.response?.status);
      console.error('   Message:', error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

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
      : `azure-${this.modelType}-${timestamp}-${randomStr}.${format}`;

    const filePath = path.join(outputDir, filename);

    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);

    return filePath;
  }
}
