import { DynamoDB } from "aws-sdk";
import { middyfy } from "libs/middify";
import * as env from "env";
import { ProductsService } from "services/products";
import { DynamoDBProductSource } from "services/products-source.dynamo";
import { handler } from "../functions/getProductsList";

const productsService = new ProductsService(
  new DynamoDBProductSource(new DynamoDB.DocumentClient(), env)
);

export const main = middyfy(handler.bind(null, productsService), env);
