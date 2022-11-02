import { describe, test, expect, vitest } from "vitest";
import {
  createMockSQSRecord,
  createMockContext,
} from "@homeservenow/serverless-event-mocks";
import type { SQSRecord } from "aws-lambda";
import type { ProductsService } from "services/products";
import { middyfySimpleHandler } from "@guria.dev/aws-js-practitioner-commons/middy";
import { handler } from "./catalogBatchProcess";

const makeHandler = (productsService: Partial<ProductsService>) => {
  return (event: { Records: SQSRecord[] }) => {
    const context = createMockContext();
    return middyfySimpleHandler(handler.bind(null, productsService))(
      // @ts-expect-error - middy has wrong type expectations here
      event,
      context
    );
  };
};

describe("catalogBatchProcess", () => {
  test("should create products", async () => {
    const createProduct = vitest.fn();
    const productsService = { createProduct };
    const event = {
      Records: [
        createMockSQSRecord({
          body: JSON.stringify({
            title: "Product 1",
            description: "Product 1 description",
            price: 100,
            count: 10,
          }),
        }),
        createMockSQSRecord({
          body: JSON.stringify({
            title: "Product 2",
            description: "Product 2 description",
            price: 200,
            count: 20,
          }),
        }),
      ],
    };
    await makeHandler(productsService)(event);

    expect(createProduct).toBeCalledTimes(2);
    expect(createProduct).toHaveBeenNthCalledWith(
      1,
      {
        title: "Product 1",
        description: "Product 1 description",
        price: 100,
        count: 10,
      },
      true
    );
    expect(createProduct).toHaveBeenNthCalledWith(
      2,
      {
        title: "Product 2",
        description: "Product 2 description",
        price: 200,
        count: 20,
      },
      true
    );
  });
});
