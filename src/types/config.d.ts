export type EffectType = "mica" | "acrylic" | "tabbed" | "auto" | "none";

export interface TranslucentConfig {
  effect: EffectType;
  opacity: number;
  editorContainerBorderVisible: boolean;
  leftSidebarContainerBorderVisible: boolean;
  rightSidebarContainerBorderVisible: boolean;
  editorContainerBackgroundOpacity: number;
  leftSidebarContainerBackgroundOpacity: number;
  rightSidebarContainerBackgroundOpacity: number;
  applyToJupyterNotebook: boolean;
}
