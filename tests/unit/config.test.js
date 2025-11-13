/**
 * Unit tests for config.js
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { Config } from '../../src/config.js';

describe('Config', () => {
  let originalEnv;

  before(() => {
    // Save original env
    originalEnv = { ...process.env };
  });

  after(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should default to google provider', () => {
      delete process.env.IMAGE_PROVIDER;

      const config = new Config();

      assert.strictEqual(config.provider, 'google');
    });

    it('should load google provider config', () => {
      process.env.IMAGE_PROVIDER = 'google';
      process.env.GEMINI_API_KEY = 'test-gemini-key';

      const config = new Config();

      assert.strictEqual(config.provider, 'google');
      assert.strictEqual(config.geminiApiKey, 'test-gemini-key');
    });

    it('should load azure provider config', () => {
      process.env.IMAGE_PROVIDER = 'azure';
      process.env.AZURE_OPENAI_ENDPOINT = 'https://test.openai.azure.com';
      process.env.AZURE_OPENAI_API_KEY = 'test-key';
      process.env.AZURE_OPENAI_DEPLOYMENT = 'flux-test';

      const config = new Config();

      assert.strictEqual(config.provider, 'azure');
      assert.strictEqual(config.endpoint, 'https://test.openai.azure.com');
      assert.strictEqual(config.apiKey, 'test-key');
      assert.strictEqual(config.deployment, 'flux-test');
    });

    it('should use default deployment if not provided', () => {
      delete process.env.AZURE_OPENAI_DEPLOYMENT;

      const config = new Config();

      assert.strictEqual(config.deployment, 'flux-1-1-pro');
    });

    it('should use default API version if not provided', () => {
      delete process.env.AZURE_OPENAI_API_VERSION;

      const config = new Config();

      assert.strictEqual(config.apiVersion, '2025-04-01-preview');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid google config', () => {
      process.env.IMAGE_PROVIDER = 'google';
      process.env.GEMINI_API_KEY = 'test-key';

      const config = new Config();

      assert.doesNotThrow(() => config.validate());
    });

    it('should pass validation with valid azure config', () => {
      process.env.IMAGE_PROVIDER = 'azure';
      process.env.AZURE_OPENAI_ENDPOINT = 'https://test.openai.azure.com';
      process.env.AZURE_OPENAI_API_KEY = 'test-key';

      const config = new Config();

      assert.doesNotThrow(() => config.validate());
    });

    it('should throw error if google provider missing API key', () => {
      process.env.IMAGE_PROVIDER = 'google';
      delete process.env.GEMINI_API_KEY;

      const config = new Config();

      assert.throws(
        () => config.validate(),
        /GEMINI_API_KEY is required when using Google provider/
      );
    });

    it('should throw error if azure provider missing endpoint', () => {
      process.env.IMAGE_PROVIDER = 'azure';
      delete process.env.AZURE_OPENAI_ENDPOINT;
      process.env.AZURE_OPENAI_API_KEY = 'test-key';

      const config = new Config();

      assert.throws(
        () => config.validate(),
        /AZURE_OPENAI_ENDPOINT is required when using Azure provider/
      );
    });

    it('should throw error if azure provider missing API key', () => {
      process.env.IMAGE_PROVIDER = 'azure';
      process.env.AZURE_OPENAI_ENDPOINT = 'https://test.openai.azure.com';
      delete process.env.AZURE_OPENAI_API_KEY;

      const config = new Config();

      assert.throws(
        () => config.validate(),
        /AZURE_OPENAI_API_KEY is required when using Azure provider/
      );
    });

    it('should throw error with unknown provider', () => {
      process.env.IMAGE_PROVIDER = 'unknown';

      const config = new Config();

      assert.throws(
        () => config.validate(),
        /Unknown IMAGE_PROVIDER: unknown/
      );
    });

    it('should throw error with multiple missing azure fields', () => {
      process.env.IMAGE_PROVIDER = 'azure';
      delete process.env.AZURE_OPENAI_ENDPOINT;
      delete process.env.AZURE_OPENAI_API_KEY;

      const config = new Config();

      assert.throws(() => config.validate(), (err) => {
        return (
          err.message.includes('AZURE_OPENAI_ENDPOINT is required') &&
          err.message.includes('AZURE_OPENAI_API_KEY is required')
        );
      });
    });
  });

  describe('getModelType', () => {
    it('should detect Flux model from deployment name', () => {
      process.env.AZURE_OPENAI_DEPLOYMENT = 'flux-1-1-pro';

      const config = new Config();

      assert.strictEqual(config.getModelType(), 'flux');
    });

    it('should detect Flux model from deployment name with uppercase', () => {
      process.env.AZURE_OPENAI_DEPLOYMENT = 'FLUX-schnell';

      const config = new Config();

      assert.strictEqual(config.getModelType(), 'flux');
    });

    it('should detect gpt-image-1 model from deployment name', () => {
      process.env.AZURE_OPENAI_DEPLOYMENT = 'gpt-image-1';

      const config = new Config();

      assert.strictEqual(config.getModelType(), 'gpt-image-1');
    });

    it('should detect gpt-image-1 model from deployment name with mini', () => {
      process.env.AZURE_OPENAI_DEPLOYMENT = 'gpt-image-1-mini';

      const config = new Config();

      assert.strictEqual(config.getModelType(), 'gpt-image-1');
    });

    it('should default to flux for unknown deployment names', () => {
      process.env.AZURE_OPENAI_DEPLOYMENT = 'unknown-model';

      const config = new Config();

      assert.strictEqual(config.getModelType(), 'flux');
    });
  });

  describe('getApiUrl', () => {
    it('should construct correct API URL', () => {
      process.env.AZURE_OPENAI_ENDPOINT = 'https://test.openai.azure.com';
      process.env.AZURE_OPENAI_DEPLOYMENT = 'flux-test';
      process.env.AZURE_OPENAI_API_VERSION = '2025-01-01';

      const config = new Config();

      const expectedUrl =
        'https://test.openai.azure.com/openai/deployments/flux-test/images/generations?api-version=2025-01-01';

      assert.strictEqual(config.getApiUrl(), expectedUrl);
    });

    it('should handle endpoint with trailing slash', () => {
      process.env.AZURE_OPENAI_ENDPOINT = 'https://test.openai.azure.com/';
      process.env.AZURE_OPENAI_DEPLOYMENT = 'flux-test';
      process.env.AZURE_OPENAI_API_VERSION = '2025-01-01';

      const config = new Config();

      // URL should still be valid even with double slash
      const url = config.getApiUrl();
      assert.ok(url.includes('openai/deployments/flux-test/images/generations'));
    });
  });
});
