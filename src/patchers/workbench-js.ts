import * as fs from "fs";

const MARKER = "vscode-translucent-patched";
const MARKER_RE = /vscode-translucent-patched/;

const FIND =
  /background-color:\s*\$\{([\w$]+)\};\s*color:\s*\$\{([\w$]+)\};\s*margin:\s*0;\s*padding:\s*0;\s*\}/;

export function isPatched(content: string): boolean {
  return MARKER_RE.test(content);
}

export function patch(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (isPatched(content)) {
    content = doUnpatch(content);
  }
  const match = FIND.exec(content);
  if (!match) {
    throw new Error(
      "Could not find initialShellColors template in workbench.js",
    );
  }
  const [, bgVar, fgVar] = match;
  const replacement =
    `background-color:transparent;color:\${${fgVar}};margin:0;padding:0;}` +
    "#monaco-parts-splash,#monaco-parts-splash *{background-color:transparent!important}" +
    `/*${MARKER}:${match[0]}*/`;

  content = content.replace(FIND, replacement);
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

export function doUnpatch(content: string): string {
  return content.replace(
    /background-color:\s*transparent\s*;\s*color:\s*\$\{[\w$]+\};\s*margin:\s*0;\s*padding:\s*0;\s*\}\s*#monaco-parts-splash\s*,\s*#monaco-parts-splash\s*\*\s*\{\s*background-color:\s*transparent\s*!important\s*\}\s*\/\*vscode-translucent-patched(?::(.*?))?\*\//g,
    (_match, orig) => orig || "background-color: ${l}; color: ${d}; margin: 0; padding: 0; }",
  );
}

export function unpatch(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (!isPatched(content)) {
    return false;
  }
  content = doUnpatch(content);
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

