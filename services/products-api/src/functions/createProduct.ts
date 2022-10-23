import { createError } from "@middy/util";
import { formatJSONResponse } from "libs/formatResponse";
import type { ProductsService } from "services/products";
import invariant from "tiny-invariant";
import { Event } from "@middy/http-json-body-parser";
import { ProductWithStock } from "services/productsSource";

export async function handler(productsService: ProductsService, event: Event) {
  const { title, description, price, count } = event.body as Omit<
    ProductWithStock,
    "id"
  >;

  try {
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

  const product = await productsService.createProduct({
    title,
    description,
    price,
    count,
  });

  return formatJSONResponse(product);
}
