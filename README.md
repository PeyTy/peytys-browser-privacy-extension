# Browser Privacy Extension

![Great new logo](fire.png?raw=true)

### Screenshots

![Profiles](profiles.png?raw=true)

![Features](features.png?raw=true)

### Hopefully improves your privacy

I have no idea how it may be useful for you,
but all those tracking annoys me enough to make this experiment.

Made it years ago as a proof-of-concept. Now it's open source!

Feel free to contribute!

Canvas protection technique was based on Canvas Defender extension. Other ones
I made by trial and error by myself.
I'm very proud of my WebGL and fonts replacement tech - it's insane!

🔥 [**Join our Discord!**](https://discord.gg/kyEPrDqMQH)

### Test

I test on https://browserleaks.com
and https://fingerprintjs.com/demo
(you need to clear cookies & local storage of this site to see difference)
by https://github.com/Valve/fingerprintjs2

### How to use on Firefox

[Available at addons.mozilla.org/addon/peyty-s-browser-privacy](https://addons.mozilla.org/addon/peyty-s-browser-privacy/)

### How to use on Chrome

Download
[latest release .zip](https://github.com/PeyTy/peytys-browser-privacy-extension/releases)
and uncompress

Use `chrome://extensions/` -> `Developer mode` -> `Load unpacked`

![How to devmode](devmode.png?raw=true)

### Features

- WebGL
- Canvas
- Audio
- User Agent
- Fonts
- Battery
- Geolocation

### TODO

- Improve WebRTC handling
- Randomize profile every hour/day
- i18n
- Export/import
- More random property names (use persistent script ID)
- Make fingerprints more realistic
- Domain isolation
- More GPUs/etc models
- Options to enable/disable by feature
- Time zones
- Hide funcs with `function () { [native code] }`
- Override display languages
- Dark theme

[Support me on Patreon for more features!](https://www.patreon.com/PeyTy)

### How to build

Install `yarn` somehow.

```sh
yarn install --frozen-lockfile
yarn global add typescript
```

Call `build.bat` or do the same it does from unix terminal.

### Rules

This is a [Vanguard Source](https://github.com/GreenteaOS/.github/blob/kawaii/CODE_OF_CONDUCT.md#clasic-open-source-vs-vanguard-source-models) as it is related to privacy issues and people's lives depending on it.
