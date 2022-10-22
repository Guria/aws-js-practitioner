import { describe, test, expect } from "vitest";
import {
  createMockAPIGatewayEvent,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import { APIGatewayEvent } from "aws-lambda";
import type { ProductsService } from "services/products";
import { middyfy } from "libs/middyfy";
import { handler } from "./getProductsList";

const makeHandler = (productsService: Partial<ProductsService>) => {
  return (event: APIGatewayEvent) => {
    const context = createMockContext();
    return middyfy(handler.bind(null, productsService), {})(
      // @ts-expect-error - middy has wrong type expectations here
      event,
      context
    );
  };
};

describe("getProductsList", () => {
  test("should return products list", async () => {
    const productsService = {
      getAvailableProducts: async () => {
        return [
          {
            id: "1",
            title: "Product 1",
            description: "Product 1 description",
            price: 100,
            count: 10,
          },
          {
            id: "2",
            title: "Product 2",
            description: "Product 2 description",
            price: 200,
            count: 20,
          },
        ];
      },
    };
    const event = createMockAPIGatewayEvent({
      path: "/products",
      httpMethod: "GET",
    });
    const products = await makeHandler(productsService)(event);

    expect(products).toMatchObject({
      statusCode: 200,
      body: JSON.stringify([
        {
          id: "1",
          title: "Product 1",
          description: "Product 1 description",
          price: 100,
          count: 10,
        },
        {
          id: "2",
          title: "Product 2",
          description: "Product 2 description",
          price: 200,
          count: 20,
        },
      ]),
    });
  });
});
