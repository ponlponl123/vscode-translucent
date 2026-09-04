import { TranslucentConfig } from "./config";

export type CSSOptions = (Partial<TranslucentConfig> & {
  vscodeVersion?: string;
  editorContainerRound?: string | number;
  leftSidebarContainerRound?: string | number;
  rightSidebarContainerRound?: string | number;
  activityBarContainerRound?: string | number;
  activityBarBorderVisible?: boolean;
  activityBarBackgroundOpacity?: number;
  activityBarMargin?: string | number;
  activityBarGap?: string | number;
  activityBarContainerGapBetweenWorkspace?: string | number;
}) | number;

export interface NormalizedCSSOptions {
  baseOpacity: number;
  editorOpacity: number;
  leftSidebarOpacity: number;
  rightSidebarOpacity: number;
  activityBarOpacity: number;
  basePct: number;
  editorPct: number;
  leftSidebarPct: number;
  rightSidebarPct: number;
  activityBarPct: number;
  editorBorderVisible: boolean;
  leftSidebarBorderVisible: boolean;
  rightSidebarBorderVisible: boolean;
  activityBarBorderVisible: boolean;
  editorBorderRadius: string;
  leftSidebarBorderRadius: string;
  rightSidebarBorderRadius: string;
  activityBarBorderRadius: string;
  activityBarMargin: string;
  activityBarMarginLeft: string;
  activityBarMarginRight: string;
  activityBarGap: string;
  applyToJupyterNotebook: boolean;
  vscodeVersion?: string;
}
