#!/usr/bin/env node

/**
 * Claude Code Image Generation MCP Server
 *
 * MCP server that provides image generation capabilities using multiple providers:
 * - Google Gemini (Nano Banana) - Default, fast and free-tier friendly
 * - Azure OpenAI (Flux/gpt-image-1) - Alternative with more control
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import path from 'path';
import config from './config.js';
import { createImageProvider } from './providerFactory.js';

// Create the image provider based on configuration
let imageProvider;
try {
  config.validate();
  imageProvider = createImageProvider();
  console.error(`✅ [MCP Server] Using ${config.provider} provider`);
} catch (error) {
  console.error(`❌ [MCP Server] Configuration error: ${error.message}`);
  process.exit(1);
}

/**
 * Build a prompt optimized for UI/app screenshot generation
 */
function buildUIPrompt(description, style, type) {
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

  prompt += 'The design should look professional and realistic, like a real application screenshot.';

  return prompt;
}

// Create MCP server using modern API
const server = new McpServer({
  name: 'claude-image-agent',
  version: '1.0.0',
});

/**
 * Tool: generate_image
 * Generate an image from a text prompt
 */
server.tool(
  'generate_image',
  'Generate an image from a detailed text prompt using Google Gemini (default) or Azure OpenAI. ' +
    'Google Gemini (Nano Banana) is fast and free-tier friendly. Azure supports Flux/gpt-image-1 with more control. ' +
    'Supports various sizes and quality settings. ' +
    'Returns the file path to the generated image. IMPORTANT: Provide detailed, descriptive prompts (at least 10 characters).',
  {
    prompt: z.string().min(10).describe('Detailed image generation prompt describing what to create (minimum 10 characters, be specific and descriptive)'),
    quality: z.enum(['standard', 'hd', 'low', 'medium', 'high']).optional().describe('Image quality - Flux: "standard"/"hd", gpt-image-1: "low"/"medium"/"high" (default: standard)'),
    size: z.string().optional().describe('Image size - shortcuts: small (512x512), medium (1024x1024), large (1440x1440), square (1024x1024), portrait (1024x1440), landscape (1440x1024), or custom WxH format like "1024x768" (Flux: 256-1440, must be multiple of 32). Default: medium'),
    filename: z.string().optional().describe('Optional custom filename (without extension)'),
    workingDirectory: z.string().optional().describe('Working directory where the image should be saved (defaults to current directory). Pass your current working directory to save images relative to your project.'),
  },
  async ({ prompt, quality, size, filename, workingDirectory }) => {
    const result = await imageProvider.generateImage(prompt, {
      quality: quality || 'standard',
      size: size || 'medium',
      outputFormat: 'png',
      outputCompression: 100,
      filename: filename || null,
      workingDirectory: workingDirectory || null,
    });

    // Calculate relative path from working directory (or cwd if not provided)
    const baseDir = workingDirectory || process.cwd();
    const relativePath = path.relative(baseDir, result.path).replace(/\\/g, '/');
    const absolutePath = result.path.replace(/\\/g, '/');
    const imageFilename = path.basename(result.path);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Image generated successfully!

📁 **File saved to:** ${relativePath}
📂 **Full path:** ${absolutePath}

🔗 **How to use in your code:**
   - HTML img tag: <img src="${relativePath}" alt="${prompt.substring(0, 50)}...">
   - CSS background: background-image: url('${relativePath}');
   - File name: ${imageFilename}

📊 **Image details:**
   - Provider: ${result.provider || config.provider}
   - Size: ${result.size}
   - Quality: ${result.quality}
   - Prompt: ${result.prompt}`,
        },
        {
          type: 'image',
          data: result.base64,
          mimeType: 'image/png',
        },
      ],
    };
  }
);

/**
 * Tool: generate_ui_image
 * Generate a UI/app screenshot or mockup
 */
server.tool(
  'generate_ui_image',
  'Generate a UI/app screenshot or mockup image. Specialized for creating realistic ' +
    'user interface designs for mobile apps, web apps, dashboards, landing pages, etc. ' +
    'Perfect for building prototypes and mockups. IMPORTANT: Provide detailed descriptions (at least 20 characters) ' +
    'for best results.',
  {
    description: z.string().min(20).describe('Detailed description of the UI/app to generate (minimum 20 characters, be specific about features and layout, e.g., "A task management mobile app with a list view showing task cards with titles, due dates, and priority badges, plus a floating action button for adding new tasks")'),
    style: z.enum(['modern', 'minimal', 'professional', 'playful', 'dark', 'glassmorphism']).optional().describe('Visual style of the UI (default: modern)'),
    type: z.enum(['mobile app', 'web app', 'dashboard', 'landing page', 'e-commerce', 'social media']).optional().describe('Type of UI to generate (default: web app)'),
    size: z.string().optional().describe('Image size - shortcuts: small, medium, large, square, portrait (default), landscape, or custom WxH'),
    workingDirectory: z.string().optional().describe('Working directory where the image should be saved (defaults to current directory). Pass your current working directory to save images relative to your project.'),
  },
  async ({ description, style, type, size, workingDirectory }) => {
    // Build UI-specific prompt
    const uiPrompt = buildUIPrompt(description, style || 'modern', type || 'web app');

    const result = await imageProvider.generateImage(uiPrompt, {
      quality: 'standard',
      size: size || 'portrait',
      outputFormat: 'png',
      outputCompression: 100,
      filename: null,
      workingDirectory: workingDirectory || null,
    });

    // Calculate relative path from working directory (or cwd if not provided)
    const baseDir = workingDirectory || process.cwd();
    const relativePath = path.relative(baseDir, result.path).replace(/\\/g, '/');
    const absolutePath = result.path.replace(/\\/g, '/');
    const uiFilename = path.basename(result.path);

    return {
      content: [
        {
          type: 'text',
          text: `✅ UI mockup generated successfully!

📁 **File saved to:** ${relativePath}
📂 **Full path:** ${absolutePath}

🔗 **How to use in your code:**
   - HTML img tag: <img src="${relativePath}" alt="${description.substring(0, 50)}...">
   - CSS background: background-image: url('${relativePath}');
   - File name: ${uiFilename}

📊 **UI mockup details:**
   - Provider: ${result.provider || config.provider}
   - Size: ${result.size}
   - Style: ${style || 'modern'}
   - Type: ${type || 'web app'}
   - Description: ${description}`,
        },
        {
          type: 'image',
          data: result.base64,
          mimeType: 'image/png',
        },
      ],
    };
  }
);

/**
 * Tool: list_generated_images
 * List all previously generated images
 */
server.tool(
  'list_generated_images',
  'List all previously generated images with their file paths, sizes, and creation dates. ' +
    'Useful for reviewing past generations.',
  {},
  async () => {
    const images = await imageGenerator.listGeneratedImages();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              count: images.length,
              images: images.map((img) => ({
                name: img.name,
                path: img.path,
                size: `${(img.size / 1024).toFixed(2)} KB`,
                created: img.created.toISOString(),
              })),
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();

  console.error('Claude Code Image Generation Agent started');
  console.error('MCP Server running on stdio transport');
  console.error('Ready to generate images using Azure OpenAI');

  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
