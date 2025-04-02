import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isDev = process.env.NODE_ENV === "development";

// https://vite.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
    // Prevents replacing global in the import strings.
    global: isDev ? {} : "global",
  },
  plugins: [react()],
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
});
