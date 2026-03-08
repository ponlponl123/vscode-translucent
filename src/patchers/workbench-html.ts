import * as fs from "fs";
import { buildCSS } from "../utils/css";

const HTML_MARKER = "<!-- vscode-translucent-patched -->";
const HTML_MARKER_END = "<!-- /vscode-translucent-patched -->";

function getStyleBlock(opacity: number): string {
  return `\n\t\t${HTML_MARKER}\n\t\t<style>${buildCSS(opacity)}</style>\n\t\t${HTML_MARKER_END}`;
}

export function isPatched(content: string): boolean {
  return content.includes(HTML_MARKER);
}

function stripExisting(content: string): string {
  const start = content.indexOf(HTML_MARKER);
  const end = content.indexOf(HTML_MARKER_END);
  if (start === -1 || end === -1) {
    return content;
  }
  const before = content.lastIndexOf("\n", start);
  const after = end + HTML_MARKER_END.length;
  return (
    content.slice(0, before === -1 ? start : before) + content.slice(after)
  );
}

export function patch(filePath: string, opacity: number): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  content = stripExisting(content);
  if (!content.includes("</head>")) {
    throw new Error("Could not find </head> in workbench.html");
  }
  content = content.replace("</head>", `${getStyleBlock(opacity)}\n\t</head>`);
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

export function unpatch(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (!isPatched(content)) {
    return false;
  }
  content = stripExisting(content);
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}
