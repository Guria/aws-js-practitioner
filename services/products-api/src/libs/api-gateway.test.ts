import { describe, test, expect, vi } from "vitest";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  createMockAPIGatewayEvent,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import { createError } from "@middy/util";
import { middyfy } from "./api-gateway";

vi.mock("./env", () => ({
  CORS_ORIGINS: "foo.dev,bar.dev",
}));

describe("middify", () => {
  test("should handle known errors", async () => {
    const handler = middyfy(async () => {
      throw createError(400, "test");
    });
    const result = (await handler(
      // @ts-expect-error - middy should be able to handle this
      createMockAPIGatewayEvent(),
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("test");
  });

  test("should handle unknown errors", async () => {
    const handler = middyfy(async () => {
      throw new Error("test");
    });
    const result = (await handler(
      // @ts-expect-error - middy should be able to handle this
      createMockAPIGatewayEvent(),
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });

  test("should parse body", async () => {
    const handler = middyfy(async (event) => {
      expect(event.body).toEqual({ test: "test" });
      return { statusCode: 200, body: "test" };
    });
    await handler(
      // @ts-expect-error - middy should be able to handle this
      createMockAPIGatewayEvent({
        body: JSON.stringify({ test: "test" }),
      }),
      createMockContext()
    );
  });

  test("should add CORS headers for supported origin", async () => {
    const handler = middyfy(async () => {
      return { statusCode: 200, body: "test" };
    });
    const result = (await handler(
      // @ts-expect-error - middy should be able to handle this
      createMockAPIGatewayEvent({ headers: { origin: "https://bar.dev" } }),
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.headers).toEqual({
      "Access-Control-Allow-Origin": "https://bar.dev",
      Vary: "Origin",
    });
  });

  test("should add first origin in CORS headers for unsupported origin", async () => {
    const handler = middyfy(async () => {
      return { statusCode: 200, body: "test" };
    });
    const result = (await handler(
      // @ts-expect-error - middy should be able to handle this
      createMockAPIGatewayEvent({ headers: { origin: "https://baz.dev" } }),
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.headers).toEqual({
      "Access-Control-Allow-Origin": "https://foo.dev",
      Vary: "Origin",
    });
  });
});
