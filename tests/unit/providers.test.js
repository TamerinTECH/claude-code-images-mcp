/**
 * Unit tests for image providers
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GoogleNanaBananaProvider } from '../../src/providers/GoogleNanaBananaProvider.js';
import { AzureOpenAIProvider } from '../../src/providers/AzureOpenAIProvider.js';

describe('GoogleNanaBananaProvider', () => {
  describe('constructor', () => {
    it('should require API key', () => {
      assert.throws(
        () => new GoogleNanaBananaProvider({}),
        /Missing GEMINI_API_KEY/
      );
    });

    it('should create instance with valid config', () => {
      const provider = new GoogleNanaBananaProvider({
        apiKey: 'test-key',
        outputDir: '/tmp/test'
      });

      assert.ok(provider);
      assert.strictEqual(provider.getName(), 'google-nano-banana');
    });
  });

  describe('validate', () => {
    it('should throw error if API key is missing', () => {
      assert.throws(
        () => {
          const provider = new GoogleNanaBananaProvider({
            apiKey: 'test-key'
          });
          provider.config.apiKey = '';
          provider.validate();
        },
        /Google Gemini API key is required/
      );
    });

    it('should pass validation with valid API key', () => {
      const provider = new GoogleNanaBananaProvider({
        apiKey: 'test-key'
      });

      assert.doesNotThrow(() => provider.validate());
    });
  });

  describe('generateImage validation', () => {
    it('should reject empty prompt', async () => {
      const provider = new GoogleNanaBananaProvider({
        apiKey: 'test-key'
      });

      await assert.rejects(
        async () => await provider.generateImage('', {}),
        (err) => {
          return err.message.includes('prompt is required') ||
                 err.message.includes('Google Nano Banana image generation failed');
        }
      );
    });

    it('should reject short prompt', async () => {
      const provider = new GoogleNanaBananaProvider({
        apiKey: 'test-key'
      });

      await assert.rejects(
        async () => await provider.generateImage('short', {}),
        (err) => {
          return err.message.includes('prompt should be detailed and descriptive') ||
                 err.message.includes('Google Nano Banana image generation failed');
        }
      );
    });
  });
});

describe('AzureOpenAIProvider', () => {
  describe('constructor', () => {
    it('should require complete config', () => {
      assert.throws(
        () => new AzureOpenAIProvider({}),
        /Azure OpenAI configuration is incomplete/
      );
    });

    it('should create instance with valid config', () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-1-1-pro',
        apiVersion: '2025-04-01-preview'
      });

      assert.ok(provider);
      assert.strictEqual(provider.getName(), 'azure-openai');
    });

    it('should detect Flux model type', () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-1-1-pro',
        apiVersion: '2025-04-01-preview'
      });

      assert.strictEqual(provider.getModelType(), 'flux');
    });

    it('should detect gpt-image-1 model type', () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'gpt-image-1',
        apiVersion: '2025-04-01-preview'
      });

      assert.strictEqual(provider.getModelType(), 'gpt-image-1');
    });
  });

  describe('validate', () => {
    it('should throw error if endpoint is missing', () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-1-1-pro',
        apiVersion: '2025-04-01-preview'
      });

      provider.endpoint = '';

      assert.throws(
        () => provider.validate(),
        /Azure OpenAI endpoint is required/
      );
    });

    it('should throw error if API key is missing', () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-1-1-pro',
        apiVersion: '2025-04-01-preview'
      });

      provider.apiKey = '';

      assert.throws(
        () => provider.validate(),
        /Azure OpenAI API key is required/
      );
    });
  });

  describe('getApiUrl', () => {
    it('should construct correct API URL', () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-test',
        apiVersion: '2025-01-01'
      });

      const expectedUrl =
        'https://test.openai.azure.com/openai/deployments/flux-test/images/generations?api-version=2025-01-01';

      assert.strictEqual(provider.getApiUrl(), expectedUrl);
    });
  });

  describe('generateImage validation', () => {
    it('should reject empty prompt', async () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-1-1-pro',
        apiVersion: '2025-04-01-preview'
      });

      await assert.rejects(
        async () => await provider.generateImage(''),
        /prompt is required/
      );
    });

    it('should reject short prompt', async () => {
      const provider = new AzureOpenAIProvider({
        endpoint: 'https://test.openai.azure.com',
        apiKey: 'test-key',
        deployment: 'flux-1-1-pro',
        apiVersion: '2025-04-01-preview'
      });

      await assert.rejects(
        async () => await provider.generateImage('short'),
        /prompt should be detailed and descriptive/
      );
    });
  });
});
