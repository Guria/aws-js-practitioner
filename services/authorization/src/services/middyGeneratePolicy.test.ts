import { describe, it, expect } from "vitest";
import { middyGeneratePolicy } from "./middyGeneratePolicy";

describe("middyGeneratePolicy", () => {
  it("should generate policy", () => {
    const policy = middyGeneratePolicy.after({
      event: {
        methodArn:
          "arn:aws:execute-api:us-east-1:123456789012:1234567890/dev/GET/",
      },
      response: true,
    });
    expect(policy).toEqual({
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource:
              "arn:aws:execute-api:us-east-1:123456789012:1234567890/dev/GET/",
          },
        ],
      },
    });
  });
});
