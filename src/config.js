/**
 * Configuration Management
 *
 * Loads and validates configuration from environment variables
 * Supports multiple image generation providers: Google Gemini, Azure OpenAI
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export class Config {
  constructor() {
    // Provider selection (google, azure)
    this.provider = process.env.IMAGE_PROVIDER || 'google';

    // Google Gemini configuration
    this.geminiApiKey = process.env.GEMINI_API_KEY;

    // Azure OpenAI configuration (alternative provider)
    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    this.deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'flux-1-1-pro';
    this.apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview';
    this.apiKey = process.env.AZURE_OPENAI_API_KEY;

    // Use current working directory instead of project root
    this.outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), 'generated-images');
  }

  /**
   * Detect which model is being used based on deployment name
   * @returns {string} Model type: 'flux' or 'gpt-image-1'
   */
  getModelType() {
    const deploymentLower = this.deployment.toLowerCase();
    if (deploymentLower.includes('flux')) {
      return 'flux';
    } else if (deploymentLower.includes('gpt-image')) {
      return 'gpt-image-1';
    }
    // Default to flux
    return 'flux';
  }

  /**
   * Validate that all required configuration is present for the selected provider
   * @throws {Error} If required configuration is missing
   */
  validate() {
    const errors = [];

    if (this.provider === 'google') {
      if (!this.geminiApiKey) {
        errors.push('GEMINI_API_KEY is required when using Google provider');
      }
    } else if (this.provider === 'azure') {
      if (!this.endpoint) {
        errors.push('AZURE_OPENAI_ENDPOINT is required when using Azure provider');
      }
      if (!this.apiKey) {
        errors.push('AZURE_OPENAI_API_KEY is required when using Azure provider');
      }
    } else {
      errors.push(`Unknown IMAGE_PROVIDER: ${this.provider}. Supported values: google, azure`);
    }

    if (errors.length > 0) {
      throw new Error(
        'Configuration validation failed:\n' +
        errors.map(e => `  - ${e}`).join('\n')
      );
    }
  }

  /**
   * Get the full API URL for image generation
   * @returns {string} Complete API URL
   */
  getApiUrl() {
    const generationsPath = `openai/deployments/${this.deployment}/images/generations`;
    const params = `?api-version=${this.apiVersion}`;
    return `${this.endpoint}/${generationsPath}${params}`;
  }
}

export default new Config();
