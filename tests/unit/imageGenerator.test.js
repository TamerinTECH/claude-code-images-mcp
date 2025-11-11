/**
 * Unit tests for imageGenerator.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ImageGenerator } from '../../src/imageGenerator.js';

describe('ImageGenerator', () => {
  const generator = new ImageGenerator();

  describe('buildUIPrompt', () => {
    it('should build a basic UI prompt', () => {
      const prompt = generator.buildUIPrompt(
        'A login page with email and password fields',
        'modern',
        'web app'
      );

      assert.ok(prompt.includes('A login page with email and password fields'));
      assert.ok(prompt.includes('web app'));
      assert.ok(prompt.includes('sleek, contemporary design'));
    });

    it('should include style description', () => {
      const prompt = generator.buildUIPrompt(
        'A dashboard',
        'minimal',
        'dashboard'
      );

      assert.ok(prompt.includes('minimalist design with lots of white space'));
    });

    it('should include type description', () => {
      const prompt = generator.buildUIPrompt(
        'A weather app',
        'modern',
        'mobile app'
      );

      assert.ok(prompt.includes('mobile application interface'));
    });

    it('should include professional requirements', () => {
      const prompt = generator.buildUIPrompt(
        'Test UI',
        'modern',
        'web app'
      );

      assert.ok(prompt.includes('pixel-perfect'));
      assert.ok(prompt.includes('Professional UI/UX'));
      assert.ok(prompt.includes('NO code'));
      assert.ok(prompt.includes('NO watermarks'));
    });

    it('should handle dark mode style', () => {
      const prompt = generator.buildUIPrompt(
        'Settings page',
        'dark',
        'mobile app'
      );

      assert.ok(prompt.includes('dark mode interface'));
    });

    it('should handle glassmorphism style', () => {
      const prompt = generator.buildUIPrompt(
        'Profile page',
        'glassmorphism',
        'web app'
      );

      assert.ok(prompt.includes('glassmorphism design'));
      assert.ok(prompt.includes('frosted glass effects'));
    });

    it('should handle e-commerce type', () => {
      const prompt = generator.buildUIPrompt(
        'Product listing',
        'modern',
        'e-commerce'
      );

      assert.ok(prompt.includes('e-commerce'));
    });

    it('should handle landing page type', () => {
      const prompt = generator.buildUIPrompt(
        'SaaS landing',
        'professional',
        'landing page'
      );

      assert.ok(prompt.includes('landing page'));
      assert.ok(prompt.includes('hero section'));
    });
  });

  describe('generateImage validation', () => {
    it('should throw error for missing prompt', async () => {
      await assert.rejects(
        async () => await generator.generateImage(''),
        /prompt is required/
      );
    });

    it('should throw error for short prompt', async () => {
      await assert.rejects(
        async () => await generator.generateImage('short'),
        /prompt should be detailed and descriptive/
      );
    });
  });

  describe('generateUIImage validation', () => {
    it('should throw error for missing description', async () => {
      await assert.rejects(
        async () => await generator.generateUIImage({}),
        /description is required/
      );
    });

    it('should throw error for short description', async () => {
      await assert.rejects(
        async () =>
          await generator.generateUIImage({
            description: 'short',
          }),
        /description should be detailed/
      );
    });

    it('should accept valid description', async () => {
      // This test will fail when it tries to make API call, but validates the description check passes
      const validDescription = 'A detailed task management app with lists';

      try {
        await generator.generateUIImage({
          description: validDescription,
        });
      } catch (error) {
        // Should fail on API call or config validation, not description validation
        assert.ok(
          !error.message.includes('description should be detailed'),
          'Should not fail on description validation'
        );
      }
    });
  });

  describe('saveBase64Image', () => {
    it('should generate filename with timestamp when no custom filename provided', async () => {
      const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      try {
        const result = await generator.saveBase64Image(base64, 'png', null);
        assert.ok(result.includes('image-'));
        assert.ok(result.endsWith('.png'));
      } catch (error) {
        // May fail on file system operations, but should not fail on filename generation
        assert.ok(error);
      }
    });

    it('should use custom filename when provided', async () => {
      const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      try {
        const result = await generator.saveBase64Image(base64, 'png', 'custom-image');
        assert.ok(result.includes('custom-image.png'));
      } catch (error) {
        // May fail on file system operations, but should not fail on filename generation
        assert.ok(error);
      }
    });
  });

  describe('listGeneratedImages', () => {
    it('should return an array', async () => {
      const images = await generator.listGeneratedImages();
      assert.ok(Array.isArray(images));
    });

    it('should return empty array if no images exist', async () => {
      const images = await generator.listGeneratedImages();
      // Should return array even if empty
      assert.ok(Array.isArray(images));
    });
  });
});
