# Claude Code Image Generation MCP Server

**🎨 An open-source local MCP server for AI-powered image generation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/TamerinTECH/claude-code-generate-images-mcp/pulls)

![Claude Code Image Generation Workflow](assets/claude-mcp-workflow.png)

A local Model Context Protocol (MCP) server that provides AI-powered image generation capabilities for Claude Code using Azure OpenAI. This MCP server enables Claude Code to generate images on demand for building UI mockups, prototypes, and visual assets.

**🌟 Free to use, modify, and extend** - We welcome contributions from the community!

**📦 Production-Ready** - Includes automated installers, comprehensive testing, and full MCP integration.

**🚀 Easy Setup** - Get started in 2 minutes with our automated installer.

## Disclaimer

This software is provided by **TamerinTECH GmbH** (info@tamerin.tech) as open-source software under the MIT License. While we strive for quality and reliability:

- **No Warranty**: This software is provided "as is" without warranty of any kind, express or implied
- **Use at Your Own Risk**: Users are responsible for their own Azure OpenAI usage and associated costs
- **API Costs**: Image generation uses your Azure OpenAI quota and may incur charges
- **Not Official**: This is not an official Microsoft, Anthropic, or Azure product
- **Community Project**: This is an open-source community project - contributions welcome!

By using this software, you acknowledge that you understand and accept these terms.

## Quick Start

Get up and running in 2 minutes:

1. **Clone this repository**:
   ```bash
   git clone https://github.com/TamerinTECH/claude-code-generate-images-mcp.git
   cd claude-code-generate-images-mcp
   ```

2. **Run the automated installer**:
   - **Windows PowerShell**: `.\install.ps1`
   - **macOS/Linux/Unix**: `./install.sh`

3. **Follow the interactive prompts**:
   - The installer will guide you through Azure OpenAI configuration
   - If you already have a `.env` file, it will ask if you want to keep it
   - Choose whether to add to Claude Code automatically

4. **Start generating images!**
   ```
   > generate an image of a sunset over mountains
   > create a UI mockup for a modern dashboard
   ```

**That's it!** The installer handles everything: Node.js dependencies, configuration, testing, and Claude Code integration. You can safely re-run the installer anytime - it won't overwrite your configuration without asking.

### Manual Installation

If you prefer manual setup, see the [Manual Installation](#manual-installation) section below.

## Examples

### Creating Silly Bird Images and HTML Page

Claude Code can generate multiple images and automatically create HTML pages to display them:

```
> let's create a simple hello world html page with images of silly birds
```

Claude Code will:
1. Generate multiple silly bird images with creative prompts
2. Save them to `generated-images/` in your working directory
3. Create an HTML page with proper image references
4. Style the page with CSS gradients and layouts

**Result:**
- `generated-images/silly-bird-1.png` - A pompous bird with fancy feathers
- `generated-images/silly-bird-2.png` - A goofy bird doing a silly dance
- `generated-images/silly-bird-3.png` - A quirky bird in sunglasses
- `hello-silly-birds.html` - Complete HTML page displaying all images

### Generating UI Mockups

Create realistic app interfaces:

```
> generate a UI mockup for a modern task management app
```

**Result:** Professional UI mockup with proper spacing, typography, and visual hierarchy.

### Custom Image Generation

Generate specific images for your project:

```
> generate an image of a sunset over mountains for my hero section
```

**Result:** High-quality image saved with relative path, ready to use in your code.

### Using Generated Images

After generation, Claude Code knows the exact file paths and provides usage examples:

```html
<!-- HTML img tag -->
<img src="generated-images/silly-bird-1.png" alt="Silly bird">

<!-- CSS background -->
background-image: url('generated-images/silly-bird-1.png');
```

## Features

- **AI Image Generation**: Generate high-quality images from text prompts using Azure OpenAI (Flux or gpt-image-1)
- **Multi-Model Support**: Works with Flux (preferred) and gpt-image-1 models with automatic detection
- **UI/App Mockup Generation**: Specialized tool for creating realistic UI screenshots and app mockups
- **Flexible Sizing**: Flux supports 256x256 to 1440x1440 with custom aspect ratios (must be multiples of 32)
- **Quality Control**: Model-specific quality settings (Flux: standard/hd, gpt-image-1: low/medium/high)
- **Local Storage**: Generated images are saved locally for easy access
- **MCP Integration**: Seamlessly integrates with Claude Code via the Model Context Protocol

## Supported Models

### Flux (Recommended)

**Why Flux is Preferred:**
- **Faster generation** - Significantly quicker than gpt-image-1
- **Flexible sizing** - Any size from 256x256 to 1440x1440 (must be multiples of 32)
- **Better aspect ratios** - Create custom ratios for different use cases
- **Cost-effective** - Generally more economical for high-volume generation

**Deployments:**
- `flux-1-1-pro` - High quality, production-ready
- `flux-1-schnell` - Ultra-fast, good for prototyping

**Parameters:**
- **Size**: 256x256 to 1440x1440 (dimensions must be multiples of 32)
  - Examples: `512x512`, `1024x1440`, `1440x1024`, `768x1024`
- **Quality**: `standard` or `hd`

### gpt-image-1 (Azure OpenAI Native)

**When to use:**
- When you need Azure OpenAI native model
- Specific compliance or regional requirements

**Deployments:**
- `gpt-image-1` - Standard image generation
- `gpt-image-1-mini` - Smaller, faster variant

**Parameters:**
- **Size**: Standard Azure OpenAI image sizes
- **Quality**: `low`, `medium`, or `high`

## Prerequisites

- Node.js 18.0.0 or higher
- Azure OpenAI account with image generation deployment (Flux or gpt-image-1)
- Claude Code installed

## Installation

### Quick Install (Recommended)

Use the automated installer for your platform:

**Windows (PowerShell)**:
```powershell
# Run as Administrator or allow execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

**macOS/Linux/Unix (Bash)**:
```bash
# Make executable
chmod +x install.sh

# Run installer
./install.sh
```

The installer will:
- ✅ Check Node.js version (>= 18.0.0)
- ✅ Install npm dependencies
- ✅ Handle `.env` file configuration:
  - If `.env` exists: Ask to keep, reconfigure (with backup), or skip
  - If no `.env`: Ask to configure now or add credentials later
  - Never overwrites existing configuration without confirmation
- ✅ Optionally configure Claude Code integration
- ✅ Run tests to verify installation
- ✅ Create output directory

**Smart Configuration Handling:**
- **Existing .env**: The installer detects existing configuration and offers to keep it (recommended), create a timestamped backup before reconfiguring, or skip configuration entirely
- **No .env**: You can enter credentials during installation or choose to add them later via the `.env` template
- **Safe**: Never loses your existing credentials - backups are created automatically

### Manual Installation

If you prefer manual installation or the automated installer doesn't work:

1. **Navigate to this directory**:
   ```bash
   cd D:\work\TamerinTECH\tools\claude-code-images
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your Azure OpenAI credentials:
   ```env
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_DEPLOYMENT=flux-1-1-pro
   AZURE_OPENAI_API_VERSION=2025-04-01-preview
   ```

5. **Run tests** (optional):
   ```bash
   npm run test:unit
   ```

## Integration with Claude Code

### Quick Integration (Recommended)

The easiest way to add this MCP server to Claude Code is using the `claude mcp add` command.

**Important:** Make sure you have a `.env` file configured with your Azure OpenAI credentials first (the installer will create this for you).

**After running the installer, add the server:**

```bash
# Replace the path with your actual installation path
claude mcp add --transport stdio image-generator \
  -- node /full/path/to/claude-code-images/src/index.js
```

The server will automatically load configuration from the `.env` file in the project directory - no need to pass environment variables via command line!

**Verify the server is running:**
```bash
claude mcp list
# Should show: image-generator: node ... - ✓ Connected
```

**Managing the server:**
```bash
# View details
claude mcp get image-generator

# Remove if needed
claude mcp remove image-generator
```

### Automatic Integration (During Installation)

When you run the installer (`install.sh` or `install.ps1`), it will:
1. Create and configure your `.env` file
2. Ask if you want to add the MCP server to Claude Code
3. Run the `claude mcp add` command for you automatically

### Manual Integration (Alternative Method)

If you prefer to manually edit configuration files or the `claude mcp add` command is not available, you can add this to `~/.claude.json` (or `%USERPROFILE%\.claude.json` on Windows):

```json
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": [
        "/full/path/to/claude-code-images/src/index.js"
      ]
    }
  }
}
```

The server will automatically load configuration from the `.env` file in the project directory.

Then restart Claude Code to load the new MCP server.

## Available Tools

Once integrated, Claude Code will have access to these tools:

### 1. `generate_image`

Generate an image from any text prompt.

**Parameters**:
- `prompt` (required): Detailed description of the image (minimum 10 characters)
- `quality` (optional):
  - Flux: `standard` or `hd` (default: `standard`)
  - gpt-image-1: `low`, `medium`, or `high`
- `size` (optional): Size shortcuts or custom WxH format (default: `medium`)
  - **Shortcuts**:
    - `small` - 512x512
    - `medium` - 1024x1024
    - `large` - 1440x1440
    - `square` - 1024x1024
    - `portrait` - 1024x1440
    - `landscape` - 1440x1024
  - **Custom** (Flux only): Any WxH between 256-1440 (multiples of 32)
    - Examples: `768x1024`, `1280x768`, `960x1280`
- `filename` (optional): Custom filename without extension

**Example Usage in Claude Code**:
```
Generate a beautiful sunset over mountains with vibrant orange and purple colors reflecting in a calm lake
```

### 2. `generate_ui_image`

Generate realistic UI/app screenshots and mockups. **Optimized for rapid prototyping.**

**Parameters**:
- `description` (required): Detailed UI description (minimum 20 characters)
  - Be specific about layout, features, and components
  - Example: "A task management mobile app with a list view showing task cards with titles, due dates, and priority badges, plus a floating action button for adding new tasks"
- `style` (optional): Visual style
  - `modern` (default) - Sleek, contemporary design
  - `minimal` - Minimalist with white space
  - `professional` - Corporate business design
  - `playful` - Fun and colorful
  - `dark` - Dark mode interface
  - `glassmorphism` - Frosted glass effects
- `type` (optional): Type of UI
  - `mobile app` - Mobile application interface
  - `web app` (default) - Desktop web application
  - `dashboard` - Analytics dashboard
  - `landing page` - Marketing landing page
  - `e-commerce` - Shopping interface
  - `social media` - Social media interface
- `size` (optional): Default is `portrait` (1024x1440) for mobile views

**Example Usage in Claude Code**:
```
Create a modern mobile app UI for a fitness tracker with workout history, progress charts, and a start workout button
```

### 3. `list_generated_images`

List all previously generated images with details.

**Parameters**: None

**Example Usage in Claude Code**:
```
Show me all the images I've generated
```

## Usage Examples

### Example 1: Creating a Landing Page Mockup

**Prompt to Claude Code**:
```
Generate a professional landing page design for a SaaS product with a hero section featuring a headline about productivity, a description, call-to-action button, and a features section below with three feature cards
```

### Example 2: Generating UI Variations

**Prompt to Claude Code**:
```
Create three different UI designs for a weather app:
1. A modern style mobile app showing current weather with temperature and forecast
2. A minimal style showing just the essentials with lots of white space
3. A dark mode version with glassmorphism effects
```

### Example 3: Custom Size Image

**Prompt to Claude Code**:
```
Generate a wide banner image (1440x512) showing a modern office workspace with laptops, plants, and natural lighting
```

### Example 4: High Quality Product Mockup

**Prompt to Claude Code**:
```
Generate an HD quality e-commerce product page mockup for a luxury watch, showing the product image, description, price, and add to cart button
```

## Size Guidelines

### Flux Models
- **Minimum**: 256x256
- **Maximum**: 1440x1440
- **Constraint**: Both width and height must be multiples of 32
- **Examples**:
  - Mobile portrait: `1024x1440` or `768x1280`
  - Desktop: `1440x900` or `1280x800`
  - Square: `1024x1024` or `768x768`
  - Banner: `1440x512` or `1280x416`

### gpt-image-1 Models
- Uses standard Azure OpenAI image sizes
- Consult Azure documentation for specific size options

## Output

Generated images are saved to the `generated-images` directory by default. You can customize this location using the `OUTPUT_DIR` environment variable.

Each generated image includes:
- Timestamp-based filename (unless custom filename provided)
- Full absolute path to the saved file
- Metadata about the generation (prompt, size, quality, model type)

## Prompt Best Practices

### For General Images
- **Be specific and detailed** (minimum 10 characters)
- Include style, mood, lighting, composition
- Specify important elements and their relationships
- Examples:
  - ❌ "a cat"
  - ✅ "a fluffy orange tabby cat sitting on a windowsill with afternoon sunlight streaming in, soft focus background"

### For UI Mockups
- **Be very detailed** (minimum 20 characters)
- Describe layout structure, components, and functionality
- Mention specific UI elements (buttons, cards, navigation, etc.)
- Include content type (text, images, icons)
- Examples:
  - ❌ "dashboard"
  - ✅ "an analytics dashboard with three metric cards showing user growth, revenue, and engagement at the top, followed by a large line chart showing trends over the last 30 days, and a table of recent activities at the bottom"

## Troubleshooting

### Installer Issues

**Windows PowerShell Execution Policy Error**:
```powershell
# If you get "cannot be loaded because running scripts is disabled"
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run the installer again
.\install.ps1
```

**Unix/Linux/macOS Permission Denied**:
```bash
# Make the installer executable
chmod +x install.sh

# Run the installer
./install.sh
```

**Node.js Version Too Old**:
- The installer requires Node.js >= 18.0.0
- Download the latest LTS version from https://nodejs.org/
- After installing, restart your terminal and run the installer again

**Installer Fails to Create Config**:
- The installer may not be able to write to the Claude Code config directory
- Note the configuration shown by the installer
- Manually copy it to your config file (see "Manual Integration" section)

**Re-running the Installer**:
- It's safe to re-run the installer multiple times
- Your existing `.env` file won't be overwritten
- You'll be given options to keep, backup and reconfigure, or skip
- Dependency installation will be re-run (idempotent)

### MCP Server Not Appearing in Claude Code

1. Check that the config file path is correct
2. Verify the node path in the configuration
3. Ensure all environment variables are set correctly
4. Restart Claude Code completely
5. Check Claude Code logs for errors

### Image Generation Fails

1. Verify Azure OpenAI credentials are correct
2. Check that your Azure deployment supports image generation
3. Ensure you have sufficient quota/credits in Azure
4. Verify size constraints for your model:
   - Flux: 256-1440, multiples of 32
   - Check error message for specific validation issues
5. Ensure prompts are detailed enough (min 10 chars for images, 20 for UI)

### Invalid Size Error

- For Flux: Ensure both dimensions are multiples of 32
  - ❌ `1000x1000` (not multiple of 32)
  - ✅ `1024x1024` (32 × 32 = 1024)
- Use shortcuts to avoid errors: `small`, `medium`, `large`, `portrait`, `landscape`

### Quality Parameter Error

- Verify you're using the correct quality values for your model:
  - Flux: `standard` or `hd`
  - gpt-image-1: `low`, `medium`, or `high`
- The agent automatically detects the model, but ensure your deployment name is correct

### Permission Errors

1. Ensure the output directory is writable
2. On Unix systems, you may need to make index.js executable:
   ```bash
   chmod +x src/index.js
   ```

## Development

### Running in Development Mode

```bash
npm run dev
```

This runs the server with auto-reload on file changes.

### Testing the MCP Server

You can test the MCP server directly using stdio:

```bash
node src/index.js
```

Then send MCP protocol messages via stdin.

## Architecture

```
claude-code-images/
├── src/
│   ├── index.js           # MCP server entry point
│   ├── imageGenerator.js  # Image generation logic with model detection
│   └── config.js          # Configuration management
├── generated-images/      # Output directory for images
├── package.json
├── .env.example
└── README.md
```

## API Reference

### Configuration (config.js)

Manages Azure OpenAI configuration, validates environment variables, and detects model type.

**Methods**:
- `validate()` - Validates required configuration
- `getModelType()` - Returns 'flux' or 'gpt-image-1' based on deployment name
- `getApiUrl()` - Constructs the full API endpoint URL

### ImageGenerator (imageGenerator.js)

Core service for image generation with automatic model detection.

**Methods**:
- `generateImage(prompt, options)` - Generate any image with model-specific validation
- `generateUIImage(params)` - Generate UI mockups with optimized prompts
- `buildUIPrompt(description, style, type)` - Construct detailed UI prompts
- `saveBase64Image(base64Data, format, filename)` - Save images to disk
- `listGeneratedImages()` - List all generated images

**Validation**:
- Automatic model detection from deployment name
- Size validation based on model (Flux: 256-1440 multiples of 32)
- Quality validation (Flux: standard/hd, gpt-image-1: low/medium/high)
- Prompt length validation (min 10 chars for images, 20 for UI)

### MCP Server (index.js)

Exposes tools via the Model Context Protocol for Claude Code integration.

**Tools**:
- `generate_image` - General image generation
- `generate_ui_image` - UI mockup generation
- `list_generated_images` - List generated images

## Model Detection

The agent automatically detects which model you're using based on your deployment name:
- If deployment name contains "flux" → Flux model (supports flexible sizing)
- If deployment name contains "gpt-image" → gpt-image-1 model (standard sizes)
- Default: Flux

This allows the MCP server to apply the correct validation and parameters automatically.

## Security Notes

- Never commit your `.env` file with real credentials
- Keep your Azure OpenAI API keys secure
- Consider implementing rate limiting for production use
- Generated images are stored locally - manage disk space accordingly
- The agent validates all inputs to prevent errors

## Performance Tips

1. **Use Flux for speed** - Flux models are significantly faster
2. **Use appropriate quality** - `standard` is usually sufficient for prototypes
3. **Optimize size** - Smaller images generate faster
4. **Cache common UI elements** - Reuse generated mockups when possible
5. **Use shortcuts** - Size shortcuts (`medium`, `portrait`, etc.) are easier than custom sizes

## Testing

This project includes comprehensive unit and integration tests.

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run integration tests (requires Azure OpenAI credentials)
npm run test:integration

# Run integration tests with live API calls
RUN_API_TESTS=true npm run test:integration

# Run all tests
npm run test:all
```

### Test Coverage

- **Unit Tests**: Configuration validation, prompt building, input validation
- **Integration Tests**: Live API connection, model detection, image generation flow

## License

MIT License

Copyright (c) 2025 TamerinTECH GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**

See the [LICENSE](./LICENSE) file for full details.

## Author

**TamerinTECH GmbH**
- Email: info@tamerin.tech
- Website: https://tamerin.tech

## Contributing

**We ❤️ contributions!** This is an open-source project and everyone is welcome to use, clone, modify, and extend it for any purpose under the MIT License.

Whether you want to:
- 🐛 Fix a bug
- ✨ Add a new feature
- 📚 Improve documentation
- 🎨 Add support for more models (DALL-E, Midjourney, etc.)
- 🔧 Optimize performance
- 🌍 Translate to other languages

**Your contributions are welcome!**

### How to Contribute

1. **Fork the repository** from GitHub
2. **Clone your fork**: `git clone https://github.com/yourusername/claude-code-generate-images-mcp.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** (add features, fix bugs, improve docs)
5. **Run tests**: `npm test` (ensure all tests pass)
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request** on GitHub with a clear description

### Contribution Guidelines

- ✅ Write clear, descriptive commit messages
- ✅ Add tests for new features
- ✅ Update documentation (README, comments) as needed
- ✅ Follow existing code style (we use ESLint/Prettier)
- ✅ Ensure all tests pass before submitting PR
- ✅ Keep changes focused (one feature/fix per PR)

### Ideas for Contributors

Some areas where we'd love help:
- Support for additional image models (OpenAI DALL-E, Stability AI, etc.)
- Web interface for managing generated images
- Batch image generation
- Image editing/modification tools
- More sophisticated prompt engineering
- Performance optimizations
- Better error handling and retry logic
- Additional output formats (SVG, WebP, etc.)

### Questions or Ideas?

- 💬 **Open an issue** on GitHub for bugs or feature requests
- 📧 **Email us** at info@tamerin.tech
- 🌟 **Star the repo** if you find it useful
- 🔀 **Fork it** and build something amazing!

## Related Projects & Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/) - Official Azure OpenAI docs
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [Claude Code Documentation](https://code.claude.com/docs) - Claude Code docs
- [Flux Models](https://blackforestlabs.ai/) - Black Forest Labs Flux models

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Azure OpenAI service status
3. Check Claude Code documentation
4. Contact TamerinTECH support team
