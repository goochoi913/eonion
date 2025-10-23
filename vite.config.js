import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ Root deployment
  build: {
    outDir: "dist", // ✅ Default build folder for root
    emptyOutDir: true,
  },
});
