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

describe("getProductById", () => {
  test("should return product", async () => {
    const event = createMockAPIGatewayEvent({
      path: "/products/1",
      httpMethod: "GET",
      pathParameters: {
        productId: "1",
      },
    });
    const result = (await main(
      // @ts-expect-error - middy should be able to handle this
      event,
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        id: "1",
        title: "product 1",
        description: "description 1",
        price: 1,
      })
    );
  });
  test("should return 404 if product not found", async () => {
    const event = createMockAPIGatewayEvent({
      path: "/products/3",
      httpMethod: "GET",
      pathParameters: {
        productId: "3",
      },
    });
    const result = (await main(
      // @ts-expect-error - middy should be able to handle this
      event,
      createMockContext()
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Product not found" })
    );
  });
});
