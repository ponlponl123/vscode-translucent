# vscode-translucent (WIP)

> [!IMPORTANT]
> **UNRELEASED:**
> Only tested on windows 11 25H2 / v1.110.1, Electron 39.6.0, Node.js 22.22.0

This extension makes VS Code transparent with a blurred background.

## Installation

For now, this extension should be use with [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone).

1. Install this extension to your vscode.
2. use command `Translucent: Enable` to enable the effect. by pressing `Ctrl + Shift + P` and type `Translucent: Enable`.
3. Restart your vscode. (not just reload window)
4. Add process `Code` to your [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone).
5. In the **Advanced** section, check the **Enable blur behind**
6. Enjoy!

## Known Issues

### Flickering after using [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone)

To fix this issue, add the `--disable-gpu-compositing` flag to your VS Code shortcut target.

**Example:**

```
"C:\Users\<YourUsername>\AppData\Local\Programs\Microsoft VS Code\Code.exe" --disable-gpu-compositing
```

> **Note:** Replace `<YourUsername>` with your actual Windows username.

## Uninstall

To uninstall this extension, you need to use command `Translucent: Disable` to disable the effect. by pressing `Ctrl + Shift + P` and type `Translucent: Disable`.
Then remove process `Code` from your [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone).
And now you can uninstall this extension.

## Preview

![](./images/Screenshot%202026-03-09%20040752.png)
![](./images/Screenshot%202026-03-09%20040946.png)
![](./images/Screenshot%202026-03-09%20041319.png)
![](./images/Screenshot%202026-03-09%20041010.png)

**If u love this project u can support me by just give me some a cup of coffee!**
[Buy Me a Coffee!](https://buymeacoffee.com/ponlponl123)
