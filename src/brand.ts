// Build-time brand switch. The sadrobot server (ai.sadrobot.eu) builds without VITE_BRAND and gets sadrobot;
// the GitHub Pages workflow sets VITE_BRAND=yettel and gets the Yettel look.
export const BRAND: "yettel" | "sadrobot" = import.meta.env.VITE_BRAND === "yettel" ? "yettel" : "sadrobot";
export const SITE_NAME = BRAND === "yettel" ? "Yettel AI Daily" : "sadrobot AI Daily";
