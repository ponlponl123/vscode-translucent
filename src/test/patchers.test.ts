import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as mainJs from "../patchers/main-js";
import * as workbenchJs from "../patchers/workbench-js";
import * as workbenchHtml from "../patchers/workbench-html";

describe("Patcher Tests", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-translucent-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  describe("main.js patcher", () => {
    const sampleMainJsVariants = [
      {
        name: "Variant with variable 'n'",
        content: `
          const win = new BrowserWindow({
            backgroundColor: n.getBackgroundColor(),
            experimentalDarkMode: !0
          });
          n.setBackgroundColor(t.colorInfo.background);
          this._view.setBackgroundColor("#FFFFFF");
        `,
      },
      {
        name: "Variant with variable 'e' and 'a'",
        content: `
          const win = new BrowserWindow({
            backgroundColor: e.getBackgroundColor(),
            experimentalDarkMode: true
          });
          e.setBackgroundColor(a.colorInfo.background);
          this._view.setBackgroundColor("#FFFFFF");
        `,
      },
      {
        name: "Variant with variable 't' and 'r'",
        content: `
          const win = new BrowserWindow({
            backgroundColor: t.getBackgroundColor(),
            experimentalDarkMode: !0
          });
          t.setBackgroundColor(r.colorInfo.background);
          e._view.setBackgroundColor("#FFFFFF");
        `,
      },
      {
        name: "Legacy variant (v1.107.0 without view setBackgroundColor)",
        content: `
          const win = new BrowserWindow({
            backgroundColor: n.getBackgroundColor(),
            experimentalDarkMode: !0
          });
          n.setBackgroundColor(t.colorInfo.background);
        `,
      },
    ];

    for (const variant of sampleMainJsVariants) {
      it(`patches and unpatches main.js correctly (${variant.name})`, () => {
        const filePath = path.join(tmpDir, "main.js");
        fs.writeFileSync(filePath, variant.content, "utf-8");

        assert.strictEqual(mainJs.isPatched(variant.content), false);

        // Patch with mica
        mainJs.patch(filePath, "mica");
        let patchedContent = fs.readFileSync(filePath, "utf-8");
        assert.strictEqual(mainJs.isPatched(patchedContent), true);
        assert.ok(patchedContent.includes('backgroundColor:"#00000000"'));
        assert.ok(patchedContent.includes('backgroundMaterial:"mica"'));

        // Repatch with acrylic
        mainJs.patch(filePath, "acrylic");
        patchedContent = fs.readFileSync(filePath, "utf-8");
        assert.strictEqual(mainJs.isPatched(patchedContent), true);
        assert.ok(patchedContent.includes('backgroundMaterial:"acrylic"'));

        // Unpatch
        mainJs.unpatch(filePath);
        const unpatchedContent = fs.readFileSync(filePath, "utf-8");
        assert.strictEqual(mainJs.isPatched(unpatchedContent), false);

        // Verify restored content matches original (modulo formatting whitespace)
        assert.strictEqual(
          unpatchedContent.replace(/\s+/g, " ").trim(),
          variant.content.replace(/\s+/g, " ").trim()
        );
      });
    }
  });

  describe("workbench.js patcher", () => {
    const sampleWorkbenchJsVariants = [
      {
        name: "Default template with ${l} and ${d}",
        content: `const style = "background-color: \${l}; color: \${d}; margin: 0; padding: 0; }";`,
      },
      {
        name: "Template with ${e} and ${t}",
        content: `const style = "background-color: \${e}; color: \${t}; margin: 0; padding: 0; }";`,
      },
    ];

    for (const variant of sampleWorkbenchJsVariants) {
      it(`patches and unpatches workbench.js correctly (${variant.name})`, () => {
        const filePath = path.join(tmpDir, "workbench.js");
        fs.writeFileSync(filePath, variant.content, "utf-8");

        assert.strictEqual(workbenchJs.isPatched(variant.content), false);

        workbenchJs.patch(filePath);
        const patchedContent = fs.readFileSync(filePath, "utf-8");
        assert.strictEqual(workbenchJs.isPatched(patchedContent), true);
        assert.ok(patchedContent.includes("background-color:transparent"));
        assert.ok(patchedContent.includes("#monaco-parts-splash"));

        workbenchJs.unpatch(filePath);
        const unpatchedContent = fs.readFileSync(filePath, "utf-8");
        assert.strictEqual(workbenchJs.isPatched(unpatchedContent), false);
        assert.strictEqual(
          unpatchedContent.replace(/\s+/g, " ").trim(),
          variant.content.replace(/\s+/g, " ").trim()
        );
      });
    }
  });

  describe("workbench.html patcher", () => {
    it("patches and unpatches workbench.html correctly", () => {
      const sampleHtml = `<!DOCTYPE html><html><head><title>VS Code</title></head><body></body></html>`;
      const filePath = path.join(tmpDir, "workbench.html");
      fs.writeFileSync(filePath, sampleHtml, "utf-8");

      assert.strictEqual(workbenchHtml.isPatched(sampleHtml), false);

      workbenchHtml.patch(filePath, {
        opacity: 0.8,
        editorContainerBorderVisible: false,
        leftSidebarContainerBorderVisible: false,
        rightSidebarContainerBorderVisible: false,
        editorContainerBackgroundOpacity: 0.5,
        leftSidebarContainerBackgroundOpacity: 0.4,
        rightSidebarContainerBackgroundOpacity: 0.6,
        applyToJupyterNotebook: true,
      });
      let patchedContent = fs.readFileSync(filePath, "utf-8");
      assert.strictEqual(workbenchHtml.isPatched(patchedContent), true);
      assert.ok(patchedContent.includes("vscode-translucent-patched"));
      assert.ok(patchedContent.includes("50%"));
      assert.ok(patchedContent.includes("40%"));
      assert.ok(patchedContent.includes("60%"));
      assert.ok(patchedContent.includes("--vscode-notebook-editorBackground: transparent !important;"));

      workbenchHtml.unpatch(filePath);
      const unpatchedContent = fs.readFileSync(filePath, "utf-8");
      assert.strictEqual(workbenchHtml.isPatched(unpatchedContent), false);
      assert.strictEqual(
        unpatchedContent.replace(/\s+/g, " ").trim(),
        sampleHtml.replace(/\s+/g, " ").trim()
      );
    });

    it("applies version-specific styles dynamically across entire version range", () => {
      const filePath = path.join(tmpDir, "workbench.html");
      fs.writeFileSync(filePath, `<html><head></head><body></body></html>`, "utf-8");

      // Legacy versions (< 1.134.0)
      const legacyVersions = ["1.110.0", "1.110.1", "v1.110.1", "1.132.0", "1.133.0", "1.133.9"];
      for (const ver of legacyVersions) {
        workbenchHtml.patch(filePath, { opacity: 0.7, vscodeVersion: ver });
        const content = fs.readFileSync(filePath, "utf-8");
        assert.ok(
          !content.includes(":not(.monaco-modal-editor-block)"),
          `Expected ${ver} NOT to include modal block filter`
        );
        assert.ok(
          content.includes(".monaco-workbench .part.editor>.content .editor-group-container>.editor-container"),
          `Expected ${ver} to include legacy editor selector`
        );
      }

      // Modern versions (>= 1.134.0) and undefined (defaults to latest)
      const modernVersions = ["1.134.0", "1.134.1", "v1.134.0", "1.135.0", "1.135.0-insider", "1.200.0", undefined];
      for (const ver of modernVersions) {
        workbenchHtml.patch(filePath, { opacity: 0.7, vscodeVersion: ver });
        const content = fs.readFileSync(filePath, "utf-8");
        assert.ok(
          content.includes("monaco-grid-view"),
          `Expected ${ver ?? "undefined"} to include monaco-grid-view`
        );
        assert.ok(
          content.includes(":not(.monaco-modal-editor-block)"),
          `Expected ${ver ?? "undefined"} to include modal block filter`
        );
      }
    });
    it("throws error when </head> is missing in workbench.html", () => {
      const filePath = path.join(tmpDir, "invalid-workbench.html");
      fs.writeFileSync(filePath, "<html><body>No Head Tag</body></html>", "utf-8");
      assert.throws(() => workbenchHtml.patch(filePath), /Could not find <\/head>/);
    });

    it("handles unpatching an unpatched file gracefully", () => {
      const filePath = path.join(tmpDir, "clean-workbench.html");
      fs.writeFileSync(filePath, "<html><head></head><body></body></html>", "utf-8");
      assert.strictEqual(workbenchHtml.unpatch(filePath), false);
    });
  });
});

