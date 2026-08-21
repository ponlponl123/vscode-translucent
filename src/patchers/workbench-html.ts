import * as fs from "fs";
import { buildCSS, CSSOptions } from "../utils/css";

const HTML_MARKER = "<!-- vscode-translucent-patched -->";
const HTML_MARKER_END = "<!-- /vscode-translucent-patched -->";

function getStyleBlock(options?: CSSOptions | number): string {
  return `\n\t\t${HTML_MARKER}\n\t\t<style>${buildCSS(options)}</style>\n\t\t${HTML_MARKER_END}`;
}

export function isPatched(content: string): boolean {
  return content.includes(HTML_MARKER);
}

function stripExisting(content: string): string {
  return content.replace(
    /\n?\t*<!-- vscode-translucent-patched -->[\s\S]*?<!-- \/vscode-translucent-patched -->\n?\t*/g,
    ""
  );
}

export function patch(filePath: string, options?: CSSOptions | number): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  content = stripExisting(content);
  if (!content.includes("</head>")) {
    throw new Error("Could not find </head> in workbench.html");
  }
  content = content.replace("</head>", `${getStyleBlock(options)}\n\t</head>`);
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
