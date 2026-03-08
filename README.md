# vscode-translucent

> [!UNRELEASED]
> Only tested on windows 11 25H2 / v1.110.1, Electron 39.6.0, Node.js 22.22.0

This extension will make vscode transparent with blur background and u free to setting your transparent background. like how much opacity, blur, saturation, brabrabra.

## Installation

For now, this extension should be use with [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone).

1. Install this extension to your vscode.
2. Add process `Code` to your [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone).
3. In the **Advanced** section, check the **Enable blur behind**
4. Enjoy!

## Known Issues

### Flickering after using [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone)

To fix this issue, add the `--disable-gpu-compositing` flag to your VS Code shortcut target.

**Example:**

```
"C:\Users\<YourUsername>\AppData\Local\Programs\Microsoft VS Code\Code.exe" --disable-gpu-compositing
```

> **Note:** Replace `<YourUsername>` with your actual Windows username.

## Preview

![](./images/Screenshot%202026-03-09%20040752.png)
![](./images/Screenshot%202026-03-09%20040946.png)
![](./images/Screenshot%202026-03-09%20041319.png)
![](./images/Screenshot%202026-03-09%20041010.png)

**If u love this project u can support me by just give me some a cup of coffee!**
[Buy Me a Coffee!](https://buymeacoffee.com/ponlponl123)
