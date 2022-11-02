import type { DynamoDB, SNS } from "aws-sdk";
import type {
  ProductsSource,
  Product,
  ProductStock,
  ProductWithStock,
} from "./productsSource";

type Env = {
  PRODUCTS_TABLE: string;
  PRODUCT_STOCKS_TABLE: string;
  PRODUCT_IMPORTED_TOPIC: string;
  WEBAPP_URL: string;
};

type Services = {
  dynamoDB: DynamoDB.DocumentClient;
  genUid: () => string;
  sns: SNS;
};

export class AWSProductSource implements ProductsSource {
  private dynamoDB: DynamoDB.DocumentClient;
  private genUid: () => string;
  private sns: SNS;

  constructor(services: Services, private env: Env) {
    this.dynamoDB = services.dynamoDB;
    this.genUid = services.genUid;
    this.sns = services.sns;
  }

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

  public async createProduct(
    product: Omit<ProductWithStock, "id">
  ): Promise<ProductWithStock> {
    const { count, ...productWithoutCount } = product;
    const newProduct = { ...productWithoutCount, id: this.genUid() };

    await this.dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: this.env.PRODUCTS_TABLE,
              Item: newProduct,
            },
          },
          {
            Put: {
              TableName: this.env.PRODUCT_STOCKS_TABLE,
              Item: { productId: newProduct.id, count },
            },
          },
        ],
      })
      .promise();
    return { ...newProduct, count };
  }

  async notifyProductImported(product: Product) {
    await this.sns
      .publish({
        TopicArn: this.env.PRODUCT_IMPORTED_TOPIC,
        MessageAttributes: {
          price: {
            DataType: "Number",
            StringValue: product.price.toString(),
          },
        },
        Subject: "Product imported",
        Message: `
Product ${product.title} created using CSV import.
You can manage create product at ${this.env.WEBAPP_URL}/admin/product-form/${product.id}
`,
      })
      .promise();
  }
}
