# Claude Code Image Generation MCP Server

**An open-source local MCP server for AI-powered image generation for your vibe coding development**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/TamerinTECH/claude-code-generate-images-mcp/pulls)

![Claude Code Image Generation Workflow](assets/claude-mcp-workflow.png)

A local MCP server that lets Claude Code (or other tools) to generate and save images directly into your project, while you vibe code. It connects to Azure OpenAI or other providers, my preferred model is Flux 1.1 Pro, you can also use gpt-image-1 or extend the code for other models.

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

* **Preferred**, Flux 1.1 Pro for UI assets and product visuals.
* **Azure alternative**, gpt-image-1 when you want Azure native path or specific constraints.
* **Extensible**, you can add adapters for other providers or custom endpoints, even experimental models.

Switch models by changing `AZURE_OPENAI_DEPLOYMENT` in `.env`.

---

## Configuration reference

`.env` keys,

* `AZURE_OPENAI_ENDPOINT`
* `AZURE_OPENAI_API_KEY`
* `AZURE_OPENAI_DEPLOYMENT`
* `AZURE_OPENAI_API_VERSION`

You can adjust output folders and file naming in the server code, so it fits your repo layout.

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

This project is provided by TamerinTECH GmbH as open source. It is not an official product of Anthropic, Microsoft, or Azure. Use at your own risk. You are responsible for your Azure OpenAI usage and costs. No warranty.

## License

MIT, see `LICENSE`.
