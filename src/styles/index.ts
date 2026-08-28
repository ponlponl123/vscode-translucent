import "../utils/css-loader";
import type { CSSOptions, NormalizedCSSOptions } from "../types";
import { normalizeOptions } from "../utils/options";
import { compareVersions } from "../utils/version";

import baseCss from "./global/base.css";
import activitybarCss from "./global/activitybar.css";
import editorCss from "./global/editor.css";
import sidebarsCss from "./global/sidebars.css";
import borderGeneralCss from "./global/border/general.css";
import borderEditorHiddenCss from "./global/border/editor-hidden.css";
import borderLeftSidebarHiddenCss from "./global/border/left-sidebar-hidden.css";
import borderRightSidebarHiddenCss from "./global/border/right-sidebar-hidden.css";
import widgetsCss from "./global/widgets.css";
import notebookCss from "./global/notebook.css";

import v1134GridCss from "./v1.134/grid.css";
import v1134ModalsCss from "./v1.134/modals.css";
import v1110LegacyEditorCss from "./v1.110/legacy-editor.css";

function getVariablesBlock(opts: NormalizedCSSOptions): string {
  return `:root {
  --vscode-translucent-base-opacity: ${opts.baseOpacity};
  --vscode-translucent-base-pct: ${opts.basePct}%;
  --vscode-translucent-editor-pct: ${opts.editorPct}%;
  --vscode-translucent-left-sidebar-pct: ${opts.leftSidebarPct}%;
  --vscode-translucent-right-sidebar-pct: ${opts.rightSidebarPct}%;
}`;
}

function getVersionStyles(opts: NormalizedCSSOptions): string[] {
  const version = opts.vscodeVersion;
  const isLegacy = version ? compareVersions(version, "1.134.0") < 0 : false;

  if (isLegacy) {
    return [v1110LegacyEditorCss];
  }

  return [v1134GridCss, v1134ModalsCss];
}

export function buildCSS(opts: CSSOptions = 0.75): string {
  const normalized = normalizeOptions(opts);
  const chunks: string[] = [getVariablesBlock(normalized)];

  if (normalized.applyToJupyterNotebook) {
    chunks.push(notebookCss);
  }

  chunks.push(baseCss);
  chunks.push(...getVersionStyles(normalized));
  chunks.push(activitybarCss);
  chunks.push(editorCss);
  chunks.push(sidebarsCss);
  chunks.push(borderGeneralCss);

  if (!normalized.editorBorderVisible) {
    chunks.push(borderEditorHiddenCss);
  }

  if (!normalized.leftSidebarBorderVisible) {
    chunks.push(borderLeftSidebarHiddenCss);
  }

  if (!normalized.rightSidebarBorderVisible) {
    chunks.push(borderRightSidebarHiddenCss);
  }

  chunks.push(widgetsCss);

  return chunks.filter(Boolean).join("\n").trim();
}
