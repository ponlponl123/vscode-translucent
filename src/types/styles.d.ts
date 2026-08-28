import { TranslucentConfig } from "./config";

export type CSSOptions = Partial<TranslucentConfig> & {
  vscodeVersion?: string;
} | number;

export interface NormalizedCSSOptions {
  baseOpacity: number;
  editorOpacity: number;
  leftSidebarOpacity: number;
  rightSidebarOpacity: number;
  basePct: number;
  editorPct: number;
  leftSidebarPct: number;
  rightSidebarPct: number;
  editorBorderVisible: boolean;
  leftSidebarBorderVisible: boolean;
  rightSidebarBorderVisible: boolean;
  applyToJupyterNotebook: boolean;
  vscodeVersion?: string;
}
