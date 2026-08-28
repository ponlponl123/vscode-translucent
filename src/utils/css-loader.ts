import * as fs from "fs";

interface NodeRequireWithExtensions {
  extensions?: Record<string, (module: NodeJS.Module, filename: string) => void>;
}

const req = (typeof require !== "undefined" ? require : undefined) as unknown as NodeRequireWithExtensions | undefined;

if (req?.extensions && !req.extensions[".css"]) {
  req.extensions[".css"] = (module: NodeJS.Module, filename: string) => {
    (module as unknown as { exports: string }).exports = fs.readFileSync(filename, "utf-8");
  };
}
