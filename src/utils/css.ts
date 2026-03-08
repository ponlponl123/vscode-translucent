export function buildCSS(opacity: number): string {
  const o = Math.max(0, Math.min(1, opacity));
  const pct = Math.round(o * 100);

  return `
body {
  background-color: transparent !important;
}
*:not(.context-view, .monaco-editor .margin, .monaco-editor .margin *, .lines-content, .lines-content *, .monaco-list-rows) {
  transition: .24s;
}
#monaco-parts-splash,
#monaco-parts-splash > div {
  background-color: transparent !important;
}
.monaco-workbench {
  background-color: color-mix(in srgb, var(--vscode-editor-background, #1e1e1e) ${pct}%, transparent) !important;
}
.monaco-workbench .part.activitybar {
  --activity-bar-width: 40px !important;
  --activity-bar-action-height: 40px !important;
  --activity-bar-icon-size: 20px !important;
  width: 48px !important;
}
.monaco-editor,
.monaco-editor .margin,
.monaco-breadcrumbs,
.monaco-workbench .part.sidebar,
.monaco-workbench .part.editor,
.monaco-workbench .part.panel,
.monaco-workbench .part>.content,
.monaco-workbench .part.auxiliarybar,
.monaco-workbench .part.titlebar,
.monaco-workbench .part.statusbar,
.monaco-workbench .part.activitybar,
.monaco-workbench .part.sidebar>.title,
.monaco-list .monaco-list-rows,
.monaco-list.list_id_2 .monaco-list-rows,
.monaco-list.list_id_3 .monaco-list-rows,
.monaco-list.list_id_4 .monaco-list-rows,
.monaco-list.list_id_5 .monaco-list-rows,
.monaco-list.list_id_7 .monaco-list-rows,
.monaco-workbench .part.auxiliarybar>.title,
.monaco-workbench .part.editor>.content .editor-group-container>.title,
.monaco-workbench .part.editor>.content .editor-group-container>.editor-container,
.monaco-workbench .part.editor>.content .editor-group-container.active>.title .tabs-container>.tab,
.editor-group-container > .editor-container .overflow-guard > .monaco-scrollable-element > .monaco-editor-background,
.monaco-workbench .part.editor>.content .editor-group-container>.title>.tabs-and-actions-container.tabs-border-bottom:after,
.monaco-workbench .part.statusbar:not(:focus).status-border-top:after,
.monaco-workbench .pane-body.integrated-terminal .xterm {
  background-color: transparent !important;
}
.monaco-menu-container,
.monaco-editor .sticky-widget,
.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container {
  backdrop-filter: blur(16px) !important;
}
.invisible.scrollbar.vertical:not(.fade)>.slider {
  margin-left: 4px;
}
.invisible.scrollbar.vertical>.slider {
  width: 8px !important;
}
canvas.decorationsOverviewRuler {
  width: 12px !important;
}
.monaco-list-row,
.monaco-editor .find-widget,
.monaco-editor .sticky-widget,
.monaco-editor .minimap canvas,
canvas.decorationsOverviewRuler,
.monaco-pane-view .pane>.pane-header,
.monaco-list.list_id_4 .monaco-list-row,
.monaco-list.list_id_5 .monaco-list-row,
.invisible.scrollbar.vertical.fade .slider,
.open-editors .monaco-list .monaco-list-row,
.monaco-list.mouse-support .monaco-list-row,
.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container,
.monaco-workbench .part>.title>.title-actions .start-debug-action-item,
.monaco-workbench .part.editor>.content .editor-group-container>.title .tabs-container,
.monaco-workbench .part.editor>.content .editor-group-container>.title .tabs-container>.tab,
.monaco-workbench .part.panel .pane-body.integrated-terminal .terminal-outer-container {
  border-radius: 6px;
}
.monaco-editor .sticky-widget {
  background-color: var(--vscode-editorStickyScrollGutter-background);
}
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar .action-item:hover a {
  background-color: var(--vscode-sideBar-background);
}
.monaco-workbench .part.sidebar>.content {
  padding-right: 4px;
  box-sizing: border-box;
}
.monaco-workbench .sidebar,
.monaco-workbench .part.titlebar,
.monaco-pane-view .pane>.pane-header,
.monaco-workbench .activitybar.bordered:before,
.monaco-workbench .part.panel.bottom .composite.title,
.monaco-workbench .part.editor>.content .editor-group-container>.title .tabs-container>.tab {
  border: none !important;
}
.monaco-workbench .part.editor>.content .editor-group-container.active>.title .tabs-container>.tab.active {
  background-color: var(--vscode-tab-activeBackground) !important;
}
.monaco-editor .scroll-decoration {
  box-shadow: none !important;
}
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar {
  padding: 4px;
}
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar .action-item {
  margin-bottom: 3px;
}
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar .action-item a {
  border-radius: 12px;
}
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar .action-item.checked a {
  background-color: var(--vscode-sideBar-background);
} 
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar .action-item:hover a {
  background-color: var(--vscode-list-hoverBackground);
}
.monaco-scrollable-element>.shadow.top,
.monaco-scrollable-element>.shadow.top-left-corner,
.monaco-workbench .activitybar>.content :not(.monaco-menu)>.monaco-action-bar .active-item-indicator,
.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-container-shadow {
  display: none !important;
}
.minimap > canvas {
  opacity: ${o};
}
`.trim();
}
