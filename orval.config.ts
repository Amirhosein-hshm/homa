import "dotenv/config";
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: process.env.SWAGGER_URL!,
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
