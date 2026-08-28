import * as assert from "assert";
import { compareVersions } from "../utils/version";
import { normalizeOptions } from "../utils/options";
import { buildCSS } from "../styles";

describe("Utils & CSS Builder Tests", () => {
  describe("compareVersions", () => {
    it("compares semver strings correctly", () => {
      assert.strictEqual(compareVersions("1.107.0", "1.107.0"), 0);
      assert.strictEqual(compareVersions("1.107.0", "1.108.0"), -1);
      assert.strictEqual(compareVersions("1.135.0", "1.134.0"), 1);
      assert.strictEqual(compareVersions("v1.135.0", "1.135.0"), 0);
      assert.strictEqual(compareVersions("1.135.0-insider", "1.135.0"), 0);
      assert.strictEqual(compareVersions("1.2", "1.2.0"), 0);
      assert.strictEqual(compareVersions("1.2.3.4", "1.2.3.5"), -1);
    });
  });

  describe("normalizeOptions", () => {
    it("handles number shorthand and clamps boundaries", () => {
      const def = normalizeOptions();
      assert.strictEqual(def.baseOpacity, 0.4);
      assert.strictEqual(def.basePct, 40);
      assert.strictEqual(def.editorPct, 40);
      assert.strictEqual(def.leftSidebarPct, 80);
      assert.strictEqual(def.rightSidebarPct, 80);
      assert.strictEqual(def.editorBorderVisible, true);
      assert.strictEqual(def.applyToJupyterNotebook, false);

      const clamped = normalizeOptions(-0.5);
      assert.strictEqual(clamped.baseOpacity, 0);
      assert.strictEqual(clamped.basePct, 0);

      const maxClamped = normalizeOptions(1.5);
      assert.strictEqual(maxClamped.baseOpacity, 1);
      assert.strictEqual(maxClamped.basePct, 100);
    });

    it("handles granular options override", () => {
      const opts = normalizeOptions({
        opacity: 0.8,
        editorContainerBackgroundOpacity: 0.5,
        leftSidebarContainerBackgroundOpacity: 0.4,
        rightSidebarContainerBackgroundOpacity: 0.6,
        editorContainerBorderVisible: false,
        leftSidebarContainerBorderVisible: false,
        rightSidebarContainerBorderVisible: false,
        applyToJupyterNotebook: true,
        vscodeVersion: "1.135.0",
      });

      assert.strictEqual(opts.basePct, 80);
      assert.strictEqual(opts.editorPct, 50);
      assert.strictEqual(opts.leftSidebarPct, 40);
      assert.strictEqual(opts.rightSidebarPct, 60);
      assert.strictEqual(opts.editorBorderVisible, false);
      assert.strictEqual(opts.leftSidebarBorderVisible, false);
      assert.strictEqual(opts.rightSidebarBorderVisible, false);
      assert.strictEqual(opts.applyToJupyterNotebook, true);
      assert.strictEqual(opts.vscodeVersion, "1.135.0");
    });
  });

  describe("buildCSS", () => {
    it("generates root CSS variables and contains necessary selectors", () => {
      const css = buildCSS({
        opacity: 0.7,
        editorContainerBackgroundOpacity: 0.6,
        leftSidebarContainerBackgroundOpacity: 0.5,
        rightSidebarContainerBackgroundOpacity: 0.8,
        applyToJupyterNotebook: true,
      });

      assert.ok(css.includes("--vscode-translucent-base-opacity: 0.7;"));
      assert.ok(css.includes("--vscode-translucent-base-pct: 70%;"));
      assert.ok(css.includes("--vscode-translucent-editor-pct: 60%;"));
      assert.ok(css.includes("--vscode-translucent-left-sidebar-pct: 50%;"));
      assert.ok(css.includes("--vscode-translucent-right-sidebar-pct: 80%;"));
      assert.ok(css.includes("--vscode-notebook-editorBackground"));
    });

    it("applies border hidden rules when disabled", () => {
      const withBorders = buildCSS({
        editorContainerBorderVisible: true,
        leftSidebarContainerBorderVisible: true,
        rightSidebarContainerBorderVisible: true,
      });
      assert.ok(!withBorders.includes("border-right: none !important;"));

      const withoutBorders = buildCSS({
        editorContainerBorderVisible: false,
        leftSidebarContainerBorderVisible: false,
        rightSidebarContainerBorderVisible: false,
      });
      assert.ok(withoutBorders.includes("border-right: none !important;"));
    });
  });
});
