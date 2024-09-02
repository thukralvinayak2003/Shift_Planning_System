import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["date-fns", "date-fns-tz"],
  },
  plugins: [react()],
});
