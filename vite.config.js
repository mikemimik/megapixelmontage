import { resolve } from "node:path";

import viteReact from "@vitejs/plugin-react";
import viteFastifyReact from "@fastify/react/plugin";

const WARNING_CODES = ["MODULE_LEVEL_DIRECTIVE"];

export default {
  root: resolve(import.meta.dirname, "client"),
  plugins: [viteReact(), viteFastifyReact()],
  ssr: {
    noExternal: ["@mui/*"],
  },
  build: {
    rollupOptions: {
      onLog(level, log, handler) {
        if (level === "warn" && log.code) {
          if (WARNING_CODES.includes(log.code)) {
            return;
          }
        } else {
          handler(level, log);
        }
      },
    },
  },
};
