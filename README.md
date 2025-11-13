# Claude Code Image Generation MCP Server

**An open-source local MCP server for AI-powered image generation for your vibe coding development**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/TamerinTECH/claude-code-generate-images-mcp/pulls)

![Claude Code Image Generation Workflow](assets/claude-mcp-workflow.png)

A local MCP server that lets Claude Code (or other tools) to generate and save images directly into your project, while you vibe code. It connects to **Google Gemini (Nano Banana)** by default, or Azure OpenAI as an alternative. Gemini is fast, has a generous free tier, and works great for most use cases. Azure supports Flux 1.1 Pro and gpt-image-1 if you need more control.

## What it is, and why it helps

* **One flow in your editor**, you ask for a page or a feature, also ask for backgrounds, icons, or illustrations, the server writes assets into your repo, Claude uses them in code.
* **Fewer switches**, no shuffling between design tools and file managers, you keep focus.
* **Consistent assets**, prompts and folders are part of your workflow, so results stay organized.
* **Reproducible**, assets live with your code, easy to review and update.

You can build a full website with hero background and section art, create app icons and onboarding illustrations, or ship internal tools that still look clean and professional.

---

## Quick start, installer

**Linux / macOS / WSL**

```bash
git clone https://github.com/TamerinTECH/claude-code-generate-images-mcp.git
cd claude-code-generate-images-mcp
./install.sh
```

**Windows PowerShell**

```powershell
git clone https://github.com/TamerinTECH/claude-code-generate-images-mcp.git
cd claude-code-generate-images-mcp
.\install.ps1
```

**Windows PowerShell (if scripts are blocked)**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

The installer checks prerequisites, installs dependencies, creates or keeps `.env`, and can register the MCP server for Claude Code.

---

## Manual setup

Do it by hand if you prefer.

1. **Install dependencies**

```bash
npm install
```

2. **Create environment file**

```bash
cp .env.example .env
```

3. **Set Azure variables in `.env`**

```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=flux-1-1-pro
AZURE_OPENAI_API_VERSION=2025-04-01-preview
```

4. **Register the MCP server in Claude Code**
   Add an entry like,

```json
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": ["<absolute-path>/claude-code-generate-images-mcp/src/index.js"]
    }
  }
}
```

5. **Run a quick check**

```bash
node src/index.js
```

---
# Working in Claude Code
![Claude Code in Action](assets/claude-code-example.png)


Describe the change you want in your project, in plain language. If the change needs images or graphics, mention them briefly, for example classroom background, icons for features, illustration for onboarding.

* You describe the feature or edit, for example add a pricing page, improve onboarding, create a timetable view.
* If visuals are needed, say what they are at a high level, for example a classroom background, three icons for features, an empty state illustration.
* The Claude agent expands your description, chooses sizes and formats, then uses this MCP server to generate the images.
* The server saves the files into your repository using stable paths, and Claude updates your code to reference them.
* You review the changes, run the app, and commit.

You do not need detailed image prompts. Short descriptions are enough, the agent will enhance and execute them.

# Prompt examples for new or existing apps

Simple prompts, specific use cases, no sizes. The agent will fill in technical details.

### Create a new web app
```
* Build a landing page for a study platform, add a classroom background with students working at desks, and three icons for practice, feedback, and progress.
* Create a marketing page for a banana-import startup, add photos or illustrations of banana stock warehouses and shipping crates, include icons for sourcing, logistics, and quality.
* Build a site for a local sports club, add a background with a weights rack in a gym, and icons for classes, trainers, and timetable.
```
### Create a new fullstack app
```
* Scaffold a study planner with a simple dashboard, add a blackboard style background for the dashboard, and category icons for homework, tests, and notes.
* Build an inventory app for a small bookstore, add a bookshelf background, and icons for fiction, science, and children sections.
* Create a fitness tracking app with a basic analytics view, add a training hall background, and an empty state illustration that shows no recent workouts yet.
```
### Extend an existing app
```
* Add a settings page with sections for profile, notifications, and privacy, generate matching icons for each section, and a light paper texture background for the page.
* Improve onboarding, add three illustrations, student learning at home on a tablet, teacher guiding a group in class, celebration of first milestone.
* Add a help center, generate a header image with a support agent at a laptop, and small icons for articles, step by step guides, and contact.
```
### Store and branding tasks
```
* Prepare store materials for a language learning app, generate a simple wordmark app icon, and backgrounds that show classroom scenes and flashcards.
* Add a branded header to a personal finance tool, create a clean wordmark and a background with a soft line chart motif.
* Create a set of user avatars that represent roles, teacher, student, and parent, keep the style consistent with the app.
```
---

## Models

* **Default (Recommended)**: **Google Gemini** (aka Nano Banana) - Fast, generous free tier, great for most use cases. Perfect for prototyping and production.
* **Azure Alternative**: **Flux 1.1 Pro** - When you need Azure's infrastructure or specific sizing control (256x256-1440x1440, multiples of 32).
* **Azure Alternative**: **gpt-image-1** - Azure OpenAI native model for specific compliance or regional requirements.
* **Extensible**: Add adapters for other providers or custom endpoints.

Switch providers by changing `IMAGE_PROVIDER` in `.env` (`google` or `azure`).

---

## Configuration reference

`.env` keys:

**Provider Selection:**
* `IMAGE_PROVIDER` - Choose `google` (default) or `azure`

**Google Gemini (when IMAGE_PROVIDER=google):**
* `GEMINI_API_KEY` - Get your free key at https://aistudio.google.com/app/apikey

**Azure OpenAI (when IMAGE_PROVIDER=azure):**
* `AZURE_OPENAI_ENDPOINT` - Your Azure resource endpoint
* `AZURE_OPENAI_API_KEY` - Your Azure API key
* `AZURE_OPENAI_DEPLOYMENT` - Model deployment name (flux-1-1-pro or gpt-image-1)
* `AZURE_OPENAI_API_VERSION` - API version (default: 2025-04-01-preview)

**Optional:**
* `OUTPUT_DIR` - Custom output directory for generated images

You can adjust output folders and file naming in the server code to fit your repo layout.

---

## How to get a Google Gemini API key

Follow these steps to create your own API key for Google's Gemini models (Nano Banana).

### 1. Create or choose a Google account

Use your existing Google account, or create a new one at `accounts.google.com`.

### 2. Open Google AI Studio

1. Go to **Google AI Studio**: https://aistudio.google.com
2. Sign in with your Google account.

### 3. Create a new API key

1. In AI Studio, click on **API keys** in the left menu (or **Get API key** button).
2. Click **Create API key**.
3. If asked, choose a Google Cloud project or create a new one.
4. Confirm and **copy the generated API key**.

This key can be used to call Gemini models, including **`gemini-2.0-flash-exp`** (Nano Banana).

### 4. Enable billing if needed

* Google Gemini has a generous free tier (15 requests per minute).
* Some usage levels may require billing on the connected Google Cloud project.
* If AI Studio asks you to enable billing, follow the steps and attach a payment method.
* Typical cost: ~$0.039 per image on paid tier (pay-as-you-go).

### 5. Add the key to the MCP server

On your machine where the MCP server runs:

1. Create or edit your `.env` file in the project folder.

2. Add your key like this:

   ```bash
   IMAGE_PROVIDER=google
   GEMINI_API_KEY=your_api_key_here
   ```

3. Save the file and restart the MCP server (or restart Claude Code).

**Your API key stays local on your system.** The MCP project does not send it to anyone else and it is not included in the repository.

---

## Troubleshooting

* **PowerShell blocks scripts**, run

  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
* **Claude Code does not list the server**, verify the `mcpServers` path and restart your editor.
* **Images not saved**, check `.env` values and write permissions for the output folder.

---

## Contributing

Community contributions are welcome, focus on practical developer flow. Good areas, better defaults, new output folders, model adapters, and tests.

---

## Disclaimer

This project is provided by TamerinTECH GmbH as open source. It is not an official product of Anthropic, Google, Microsoft, or Azure. Use at your own risk. You are responsible for your API usage and costs (Google Gemini or Azure OpenAI). No warranty.

## License

MIT, see `LICENSE`.
