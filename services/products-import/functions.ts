import type { AWS } from "@serverless/typescript";
import { IMPORT_API_PATH } from "@guria.dev/aws-js-practitioner-commons/constants/api-paths";

const config: AWS["functions"] = {
  importProductsFile: {
    handler: "src/handlers/importProductsFile.main",
    events: [
      {
        http: {
          method: "get",
          path: IMPORT_API_PATH,
          cors: true,
          request: {
            parameters: {
              querystrings: { name: true },
            },
          },
        },
      },
    ],
  },
};

export default config;
