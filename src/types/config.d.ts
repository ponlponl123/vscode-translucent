export type EffectType = "mica" | "acrylic" | "tabbed" | "auto" | "none";

export interface TranslucentConfig {
  effect: EffectType;
  opacity: number;
  editorContainerBorderVisible: boolean;
  leftSidebarContainerBorderVisible: boolean;
  rightSidebarContainerBorderVisible: boolean;
  activityBarContainerBorderVisible: boolean;
  editorContainerBackgroundOpacity: number;
  leftSidebarContainerBackgroundOpacity: number;
  rightSidebarContainerBackgroundOpacity: number;
  activityBarContainerBackgroundOpacity: number;
  editorContainerBorderRadius: string;
  leftSidebarContainerBorderRadius: string;
  rightSidebarContainerBorderRadius: string;
  activityBarContainerBorderRadius: string;
  activityBarContainerMargin: string;
  activityBarContainerGap: string;
  applyToJupyterNotebook: boolean;
}
