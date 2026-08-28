import type { CSSOptions, NormalizedCSSOptions } from "../types";

export function normalizeOptions(opts: CSSOptions = 0.4): NormalizedCSSOptions {
  const o = typeof opts === "number" ? { opacity: opts } : opts;
  const baseOpacity = Math.max(0, Math.min(1, o.opacity ?? 0.4));
  const editorOpacity = Math.max(0, Math.min(1, o.editorContainerBackgroundOpacity ?? baseOpacity));
  const leftSidebarOpacity = Math.max(0, Math.min(1, o.leftSidebarContainerBackgroundOpacity ?? 0.8));
  const rightSidebarOpacity = Math.max(0, Math.min(1, o.rightSidebarContainerBackgroundOpacity ?? 0.8));

  return {
    baseOpacity,
    editorOpacity,
    leftSidebarOpacity,
    rightSidebarOpacity,
    basePct: Math.round(baseOpacity * 100),
    editorPct: Math.round(editorOpacity * 100),
    leftSidebarPct: Math.round(leftSidebarOpacity * 100),
    rightSidebarPct: Math.round(rightSidebarOpacity * 100),
    editorBorderVisible: o.editorContainerBorderVisible ?? true,
    leftSidebarBorderVisible: o.leftSidebarContainerBorderVisible ?? true,
    rightSidebarBorderVisible: o.rightSidebarContainerBorderVisible ?? true,
    applyToJupyterNotebook: o.applyToJupyterNotebook ?? false,
    vscodeVersion: o.vscodeVersion,
  };
}
