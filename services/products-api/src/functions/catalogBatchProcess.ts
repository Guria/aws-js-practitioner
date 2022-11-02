import type { SQSEvent } from "aws-lambda/trigger/sqs";
import type { ProductsService } from "services/products";
import invariant from "tiny-invariant";
import { ProductWithStock } from "services/productsSource";
import { createError } from "@guria.dev/aws-js-practitioner-commons/middy";

export async function handler(
  productsService: ProductsService,
  event: SQSEvent
) {
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    const { title, description, price, count } = recordBody as Omit<
      ProductWithStock,
      "id"
    >;

    try {
      // TODO: reuse validation
      invariant(typeof title === "string", "Title is required");
      invariant(
        typeof description === "string" && description.length > 0,
        "Description is required"
      );
      invariant(
        typeof price === "number" && price > 0,
        "Price is required and should be greater than 0"
      );
      invariant(typeof count === "number", "Count is required");
    } catch (error) {
      throw createError(400, JSON.stringify({ message: error.message }));
    }

    // TODO: do not await here, just collect promises and await Promise.all
    const product = await productsService.createProduct(
      {
        title,
        description,
        price,
        count,
      },
      true
    );

    console.log("Created product", product);
  }
}
