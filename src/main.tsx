import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./utils/init.ts";
import "./index.css";
import App from "./App.tsx";

// const main = new Window("main");
// // main.setAlwaysOnTop(true)

// const libWindow = new WebviewWindow("library");
// libWindow.onCloseRequested(async (e) => {
//   await libWindow.hide();
//   e.preventDefault();
// });

// document.addEventListener("click", (e) => {
//   const target = e.target as HTMLElement;

//   // Traverse up to find anchor tag
//   const anchor = target.closest("a");
//   if (!anchor) return;

//   const href = anchor.getAttribute("href");
//   if (!href) return;

//   if (href.includes("https://libraries.excalidraw.com")) {
//     e.preventDefault();
//     libWindow.show();
//   }
//   if (href.includes("https://excalidraw.com")) {
//     e.preventDefault();
//     console.log("excaliii");

//     libWindow.hide();
//     main.setFocus();
//   }
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
