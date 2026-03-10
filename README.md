# vscode-translucent (WIP)

> [!IMPORTANT]
> **UNRELEASED:**
> Only tested on windows 11 25H2 / v1.110.1, Electron 39.6.0, Node.js 22.22.0

This extension makes VS Code transparent with a blurred background.

## Preview

![](./images/Screenshot%202026-03-09%20040752.png)
![](./images/Screenshot%202026-03-09%20040946.png)
![](./images/Screenshot%202026-03-09%20041319.png)
![](./images/Screenshot%202026-03-09%20041010.png)

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

### Terminal font rendering issue

![Terminal font rendering issue](./images/Screenshot%202026-03-10%20145945-2.png)

VS Code tries to use your GPU to make the terminal faster, but it can cause these exact visual artifacts. Turning it off usually solves the problem instantly.

1. Open your VS Code Settings by pressing `Ctrl + ,`.
2. In the search bar at the top, type: `terminal.integrated.gpuAcceleration`
3. Change the dropdown setting from `auto` or `on` to `off`.
4. Close your current terminal and open a new one (or restart VS Code completely).

![Terminal font rendering solved](./images/Screenshot%202026-03-10%20150009.png)

## Uninstall

To uninstall this extension, you need to use command `Translucent: Disable` to disable the effect. by pressing `Ctrl + Shift + P` and type `Translucent: Disable`.
Then remove process `Code` from your [Mica For Everyone](https://github.com/MicaForEveryone/MicaForEveryone).
And now you can uninstall this extension.

**If u love this project u can support me by just give me some a cup of coffee!**
[Buy Me a Coffee!](https://buymeacoffee.com/ponlponl123)
