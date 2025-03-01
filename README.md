# SunSlider

Simple app to protect my eyes from the power of the sun (my laptop screen) with brightness sliders in a native app. 

Built with **Tauri**. Frontend is *React/Vite* using *DaisyUI* as the UI library. Frontend interacts with a **Rust** backend that communicates with the `xrandr` program to interact with screen brightness.

## Dev

Run a local server

```
npm run dev
```

Run a lcoal server and a native app

```
npm run tauri dev
```