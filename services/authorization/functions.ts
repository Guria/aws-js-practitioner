import type { AWS } from "@serverless/typescript";

const config: AWS["functions"] = {
  basicAuthorizer: {
    handler: "src/handlers/basicAuthorizer.main",
  },
};

export default config;
