import * as fs from "fs";

const MARKER = "vscode-translucent-patched";
const MARKER_RE = /vscode-translucent-patched/;

const FIND =
  /background-color:\s*\$\{l\};\s*color:\s*\$\{d\};\s*margin:\s*0;\s*padding:\s*0;\s*\}/;

const REPLACEMENT =
  "background-color:transparent;color:${d};margin:0;padding:0;}" +
  "#monaco-parts-splash,#monaco-parts-splash *{background-color:transparent!important}" +
  `/*${MARKER}*/`;

const PATCHED =
  /background-color:\s*transparent\s*;\s*color:\s*\$\{d\};\s*margin:\s*0;\s*padding:\s*0;\s*\}\s*#monaco-parts-splash\s*,\s*#monaco-parts-splash\s*\*\s*\{\s*background-color:\s*transparent\s*!important\s*\}\s*\/\*vscode-translucent-patched\*\//;

const ORIGINAL =
  "background-color: ${l}; color: ${d}; margin: 0; padding: 0; }";

export function isPatched(content: string): boolean {
  return MARKER_RE.test(content);
}

export function patch(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (isPatched(content)) {
    content = doUnpatch(content);
  }
  if (!FIND.test(content)) {
    throw new Error(
      "Could not find initialShellColors template in workbench.js",
    );
  }
  content = content.replace(FIND, REPLACEMENT);
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

function doUnpatch(content: string): string {
  if (PATCHED.test(content)) {
    content = content.replace(PATCHED, ORIGINAL);
  }
  return content;
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
