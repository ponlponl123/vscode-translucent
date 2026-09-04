import * as assert from "assert";
import { compareVersions } from "../utils/version";
import { normalizeOptions } from "../utils/options";
import { clamp, formatSize, parseBoxValues, calcMargin } from "../utils/format";
import { buildCSS } from "../styles";

describe("Utils & CSS Builder Tests", () => {
  describe("format utils", () => {
    it("clamps values within range", () => {
      assert.strictEqual(clamp(0.5), 0.5);
      assert.strictEqual(clamp(-1), 0);
      assert.strictEqual(clamp(2), 1);
    });

    it("formats size values", () => {
      assert.strictEqual(formatSize(undefined, "8px"), "8px");
      assert.strictEqual(formatSize(8), "8px");
      assert.strictEqual(formatSize("12"), "12px");
      assert.strictEqual(formatSize("1rem"), "1rem");
    });

    it("parses box values for all standard CSS notations", () => {
      assert.deepStrictEqual(parseBoxValues(), ["0px", "2px", "2px", "2px"]);
      assert.deepStrictEqual(parseBoxValues(8), ["8px", "8px", "8px", "8px"]);
      assert.deepStrictEqual(parseBoxValues("4px"), ["4px", "4px", "4px", "4px"]);
      assert.deepStrictEqual(parseBoxValues("4px 8px"), ["4px", "8px", "4px", "8px"]);
      assert.deepStrictEqual(parseBoxValues("4px 8px 12px"), ["4px", "8px", "12px", "8px"]);
      assert.deepStrictEqual(parseBoxValues("4px 8px 12px 16px"), ["4px", "8px", "12px", "16px"]);
    });

    it("calculates margin with gap correctly", () => {
      assert.strictEqual(calcMargin("4px", "0px"), "4px");
      assert.strictEqual(calcMargin("0px", "8px"), "8px");
      assert.strictEqual(calcMargin("4px", "8px"), "calc(4px + 8px)");
    });
  });
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
      assert.strictEqual(def.activityBarPct, 0);
      assert.strictEqual(def.editorBorderVisible, true);
      assert.strictEqual(def.activityBarBorderVisible, false);
      assert.strictEqual(def.editorBorderRadius, "8px");
      assert.strictEqual(def.leftSidebarBorderRadius, "8px");
      assert.strictEqual(def.rightSidebarBorderRadius, "8px");
      assert.strictEqual(def.activityBarBorderRadius, "8px");
      assert.strictEqual(def.activityBarMargin, "0px 2px 2px 2px");
      assert.strictEqual(def.activityBarGap, "0px");
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
        activityBarContainerBackgroundOpacity: 0.7,
        editorContainerBorderVisible: false,
        leftSidebarContainerBorderVisible: false,
        rightSidebarContainerBorderVisible: false,
        activityBarContainerBorderVisible: true,
        editorContainerBorderRadius: "8px",
        leftSidebarContainerBorderRadius: "10px",
        rightSidebarContainerBorderRadius: "12px",
        activityBarContainerBorderRadius: "16px",
        activityBarContainerMargin: "4px 8px",
        activityBarContainerGap: "10px",
        applyToJupyterNotebook: true,
        vscodeVersion: "1.135.0",
      });

      assert.strictEqual(opts.basePct, 80);
      assert.strictEqual(opts.editorPct, 50);
      assert.strictEqual(opts.leftSidebarPct, 40);
      assert.strictEqual(opts.rightSidebarPct, 60);
      assert.strictEqual(opts.activityBarPct, 70);
      assert.strictEqual(opts.editorBorderVisible, false);
      assert.strictEqual(opts.leftSidebarBorderVisible, false);
      assert.strictEqual(opts.rightSidebarBorderVisible, false);
      assert.strictEqual(opts.activityBarBorderVisible, true);
      assert.strictEqual(opts.editorBorderRadius, "8px");
      assert.strictEqual(opts.leftSidebarBorderRadius, "10px");
      assert.strictEqual(opts.rightSidebarBorderRadius, "12px");
      assert.strictEqual(opts.activityBarBorderRadius, "16px");
      assert.strictEqual(opts.activityBarMargin, "4px 8px 4px 8px");
      assert.strictEqual(opts.activityBarMarginRight, "calc(8px + 10px)");
      assert.strictEqual(opts.activityBarGap, "10px");
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
        activityBarContainerBackgroundOpacity: 0.4,
        editorContainerBorderRadius: "6px",
        leftSidebarContainerBorderRadius: "8px",
        rightSidebarContainerBorderRadius: "10px",
        activityBarContainerBorderRadius: "12px",
        activityBarContainerMargin: "4px",
        activityBarContainerGap: "8px",
        applyToJupyterNotebook: true,
      });

      assert.ok(css.includes("--vscode-translucent-base-opacity: 0.7;"));
      assert.ok(css.includes("--vscode-translucent-base-pct: 70%;"));
      assert.ok(css.includes("--vscode-translucent-editor-pct: 60%;"));
      assert.ok(css.includes("--vscode-translucent-left-sidebar-pct: 50%;"));
      assert.ok(css.includes("--vscode-translucent-right-sidebar-pct: 80%;"));
      assert.ok(css.includes("--vscode-translucent-activity-bar-pct: 40%;"));
      assert.ok(css.includes("--vscode-translucent-editor-border-radius: 6px;"));
      assert.ok(css.includes("--vscode-translucent-left-sidebar-border-radius: 8px;"));
      assert.ok(css.includes("--vscode-translucent-right-sidebar-border-radius: 10px;"));
      assert.ok(css.includes("--vscode-translucent-activity-bar-border-radius: 12px;"));
      assert.ok(css.includes("--vscode-translucent-activity-bar-margin: 4px 4px 4px 4px;"));
      assert.ok(css.includes("--vscode-translucent-activity-bar-gap: 8px;"));
      assert.ok(css.includes("--vscode-notebook-editorBackground"));
    });

    it("applies border hidden rules when disabled", () => {
      const withBorders = buildCSS({
        editorContainerBorderVisible: true,
        leftSidebarContainerBorderVisible: true,
        rightSidebarContainerBorderVisible: true,
        activityBarContainerBorderVisible: true,
      });
      assert.ok(!withBorders.includes("border-right: none !important;"));

      const withoutBorders = buildCSS({
        editorContainerBorderVisible: false,
        leftSidebarContainerBorderVisible: false,
        rightSidebarContainerBorderVisible: false,
        activityBarContainerBorderVisible: false,
      });
      assert.ok(withoutBorders.includes("border-right: none !important;"));
      assert.ok(withoutBorders.includes(".activitybar.bordered:before"));
    });
  });
});
