import { DynamoDB } from "aws-sdk";
import {
  middyfyGatewayHandler,
  middyfySimpleHandler,
} from "@guria.dev/aws-js-practitioner-commons/middy";
import { ProductsService } from "services/products";
import { DynamoDBProductSource } from "services/productsSource.dynamo";
import { v4 as uuidv4 } from "uuid";
import * as env from "env";

const productsService = new ProductsService(
  new DynamoDBProductSource(new DynamoDB.DocumentClient(), uuidv4, env)
);

type ProductsServiceFunctionHandler = (
  productsService: ProductsService,
  event: unknown,
  context: unknown
) => Promise<unknown>;

export function provideProductsService(
  handler: ProductsServiceFunctionHandler
) {
  return middyfyGatewayHandler(handler.bind(null, productsService), env);
}

export function provideProductsServiceSQS(
  handler: ProductsServiceFunctionHandler
) {
  return middyfySimpleHandler(handler.bind(null, productsService));
}
