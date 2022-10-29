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
  importFileParser: {
    handler: "src/handlers/importFileParser.main",
    events: [
      {
        s3: {
          bucket: "${param:FixturesS3BucketName}",
          event: "s3:ObjectCreated:*",
          rules: [{ prefix: "uploaded/" }],
          existing: true,
          forceDeploy: true,
        },
      },
    ],
  },
};

export default config;
