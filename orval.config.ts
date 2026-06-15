import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://127.0.0.1:8000/openapi.json",
    },
    output: {
      workspace: "./lib/generated",
      mode: "tags-split",
      target: "./endpoints/index.ts",
      schemas: "./types/model",
      operationSchemas: "./types/operations",
      client: "react-query",
      clean: true,
      indexFiles: true,
      tsconfig: {
        compilerOptions: {
          target: "es2020",
        },
      },
      override: {
        mutator: {
          path: "../api/client.ts",
          name: "axiosInstance",
        },

        requestOptions: {
          type: "axios",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "node ./scripts/generate-orval-layered-exports.mjs",
    },
  },
});
