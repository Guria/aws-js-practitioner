import { describe, test, expect, vi } from "vitest";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  createMockAPIGatewayEvent,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import { main } from "./handler";

vi.mock("@guria.dev/aws-js-practitioner-commons/mocks", () => ({
  products: [
    { id: "1", title: "product 1", description: "description 1", price: 1 },
    { id: "2", title: "product 2", description: "description 2", price: 2 },
  ],
}));

describe("getProductsList", () => {
  test("should return products", async () => {
    const event = createMockAPIGatewayEvent({
      path: "/products",
      httpMethod: "GET",
    });
    const result = (await main(
      // @ts-expect-error - middy should be able to handle this
      event,
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify([
        { id: "1", title: "product 1", description: "description 1", price: 1 },
        { id: "2", title: "product 2", description: "description 2", price: 2 },
      ])
    );
  });
});
