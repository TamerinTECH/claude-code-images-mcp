/**
 * Provider Factory
 * Creates the appropriate image generation provider based on configuration
 */

import config from './config.js';
import { GoogleNanaBananaProvider } from './providers/GoogleNanaBananaProvider.js';
import { AzureOpenAIProvider } from './providers/AzureOpenAIProvider.js';

/**
 * Create an image provider based on configuration
 * @returns {ImageProvider} The configured provider instance
 */
export function createImageProvider() {
  const providerType = config.provider || 'google';

  console.error(`🔧 [Provider Factory] Creating ${providerType} provider...`);

  if (providerType === 'google') {
    return new GoogleNanaBananaProvider({
      apiKey: config.geminiApiKey,
      outputDir: config.outputDir,
    });
  } else if (providerType === 'azure') {
    return new AzureOpenAIProvider({
      endpoint: config.endpoint,
      apiKey: config.apiKey,
      deployment: config.deployment,
      apiVersion: config.apiVersion,
      outputDir: config.outputDir,
    });
  } else {
    throw new Error(`Unknown provider: ${providerType}. Supported: google, azure`);
  }
}

export default createImageProvider;
