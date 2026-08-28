# Contributing to VS Code Translucent ✨

Thank you for your interest in contributing to **vscode-translucent**! Whether you're fixing a bug, adding compatibility for new VS Code versions, improving CSS styling, or enhancing documentation, all contributions are warmly welcomed.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js** (`>= 20.x`) and **npm** (or **bun**)
- **Visual Studio Code**
- A Windows environment (Windows 11 recommended for testing backdrop effects)
- A window effect tool for testing blur/mica (e.g. [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone) or [Windhawk](https://windhawk.net/mods/translucent-windows))

### Getting Started

1. **Fork & Clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/vscode-translucent.git
   cd vscode-translucent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

> [!CAUTION]
> **Dedicated Test Host Required:**
> Because this extension modifies core VS Code workbench files (`main.js`, `index.html`, CSS injections) upon enablement, **do not test or debug on your primary daily VS Code installation**. Use a dedicated VS Code instance (e.g., VS Code Insiders or a portable installation).

3. **Build & Package the Extension**:
   Compile the source and create a `.vsix` distribution package:
   ```bash
   npm run package
   npx @vscode/vsce package
   ```

4. **Install to Dedicated VS Code Host**:
   - Open your dedicated test VS Code instance.
   - Install the generated `.vsix` file:
     ```bash
     # Via CLI (pointing to your test VS Code binary)
     code-insiders --install-extension vscode-translucent-<version>.vsix
     ```
     *(Or open Extensions view `Ctrl + Shift + X` → `...` menu → **Install from VSIX...**)*
   - Open Command Palette (`Ctrl + Shift + P`) and run:
     ```
     Translucent: Enable
     ```
   - Fully restart the test host to verify changes.

---

## 📁 Project Structure

```
vscode-translucent/
├── images/            # Preview assets (modern UI, legacy, customizations)
├── src/
│   ├── patchers/      # Patching logic for VS Code core workbench files
│   │   ├── bootstrap.ts
│   │   ├── main-js.ts
│   │   ├── index-html.ts
│   │   └── workbench-html.ts
│   ├── styles/        # CSS injection templates & stylesheets
│   │   └── index.ts
│   ├── utils/         # Configuration and environment helpers
│   │   ├── config.ts
│   │   └── paths.ts
│   └── extension.ts   # Main extension entrypoint & command handlers
├── esbuild.js         # Fast bundling configuration
└── package.json       # Manifest, configuration schema & scripts
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run compile` | Runs type checks, linter, and builds production bundle. |
| `npm run watch` | Watches for TypeScript changes and rebuilds in real-time. |
| `npm run check-types` | Validates TypeScript types (`tsc --noEmit`). |
| `npm run lint` | Runs ESLint on `src/`. |
| `npm test` | Runs the automated test suite via `@vscode/test-cli`. |
| `npm run package` | Builds the production bundle for packaging. |

---

## 💡 How to Contribute

### 1. Reporting Bugs
- Check the [Issues](https://github.com/ponlponl123/vscode-translucent/issues) page to ensure the bug hasn't already been reported.
- Include:
  - **Windows version & build** (e.g., Windows 11 25H2)
  - **VS Code version** (e.g., v1.135.0)
  - **Window tool used** (e.g., Mica For Everyone v1.3.0, Windhawk mod, etc.)
  - Steps to reproduce & screenshots if applicable.

### 2. Suggesting Enhancements & Styles
- Ideas for new customization options, improved notebook support, or theme compatibilities are always welcome.
- Open an Issue with the `enhancement` label detailing your proposal.

### 3. Submitting Pull Requests (PRs)
1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and ensure tests and linting pass:
   ```bash
   npm run check-types
   npm run lint
   npm test
   ```
3. Commit your changes with clear, descriptive commit messages.
4. Push to your fork and open a Pull Request against `main`.

---

## 🧪 Testing Guidelines

Because this extension interacts with VS Code internal CSS and workbench structure:
- Test changes against both **Dark Modern** and **Light Modern** default themes.
- Test with different container opacity settings (`vscode-translucent.opacity`, `editorContainerBackgroundOpacity`, etc.).
- Verify that workbench borders and split editors remain legible.
- Ensure terminal acceleration toggle documentation is respected if touching terminal containers.

---

## 💬 Community & Support

Have questions or need help getting started?
- Open a discussion or issue on [GitHub Issues](https://github.com/ponlponl123/vscode-translucent/issues).
- If you find this project helpful, give it a ⭐️ and share it with other developers!
