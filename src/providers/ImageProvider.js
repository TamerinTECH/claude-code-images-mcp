/**
 * Base interface for image generation providers
 * All image generation providers should extend this class
 */
export class ImageProvider {
  constructor(config) {
    this.config = config;
  }

  /**
   * Generate an image from a text prompt
   * @param {string} prompt - The text description of the image to generate
   * @param {Object} options - Provider-specific options
   * @param {string} [options.quality] - Image quality setting
   * @param {string} [options.size] - Image size
   * @param {string} [options.filename] - Custom filename
   * @param {string} [options.workingDirectory] - Directory to save the image
   * @returns {Promise<{base64: string, mimeType: string, path: string, url: string, prompt: string, size: string, quality: string, provider: string}>}
   */
  async generateImage(prompt, options = {}) {
    throw new Error('generateImage() must be implemented by provider');
  }

  /**
   * Get the provider name
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented by provider');
  }

  /**
   * Validate provider configuration
   * @throws {Error} if configuration is invalid
   */
  validate() {
    throw new Error('validate() must be implemented by provider');
  }
}
