import type { DynamoDB } from "aws-sdk";
import type { ProductsSource, Product, ProductStock } from "./products-source";

type Env = {
  PRODUCTS_TABLE: string;
  PRODUCT_STOCKS_TABLE: string;
};

export class DynamoDBProductSource implements ProductsSource {
  constructor(private dynamoDB: DynamoDB.DocumentClient, private env: Env) {}
  public async getProducts(): Promise<Product[]> {
    const result = await this.dynamoDB
      .scan({ TableName: this.env.PRODUCTS_TABLE })
      .promise();
    return result.Items as Product[];
  }

  public async getProduct(id: string): Promise<Product | undefined> {
    const result = await this.dynamoDB
      .get({ TableName: this.env.PRODUCTS_TABLE, Key: { id } })
      .promise();
    return result.Item as Product | undefined;
  }

  public async getProductsStocks(): Promise<ProductStock[]> {
    const result = await this.dynamoDB
      .scan({ TableName: this.env.PRODUCT_STOCKS_TABLE })
      .promise();
    return result.Items as ProductStock[];
  }

  public async getProductStock(id: string): Promise<number | undefined> {
    const result = await this.dynamoDB
      .get({ TableName: this.env.PRODUCT_STOCKS_TABLE, Key: { productId: id } })
      .promise();
    return result.Item?.count;
  }
}
