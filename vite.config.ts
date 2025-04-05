
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  base: './', // This makes asset paths relative, important for subdirectory deployment
  build: {
    outDir: 'dist', // Output directory for build
    emptyOutDir: true, // Clear the output directory before building
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
