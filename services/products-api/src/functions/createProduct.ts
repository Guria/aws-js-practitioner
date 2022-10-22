import { createError } from "@middy/util";
import { formatJSONResponse } from "libs/formatResponse";
import type { ProductsService } from "services/products";
import invariant from "tiny-invariant";
import { Event } from "@middy/http-json-body-parser";
import { Product } from "services/productsSource";

export async function handler(productsService: ProductsService, event: Event) {
  const { title, description, price } = event.body as Product;

  try {
    invariant(title && typeof title === "string", "Title is required");
    invariant(
      description && typeof description === "string",
      "Description is required"
    );
    invariant(
      price && typeof price === "number" && price > 0,
      "Price is required and should be greater than 0"
    );
  } catch (error) {
    throw createError(400, JSON.stringify({ message: error.message }));
  }

  const product = await productsService.createProduct({
    title,
    description,
    price,
  });

  return formatJSONResponse(product);
}
