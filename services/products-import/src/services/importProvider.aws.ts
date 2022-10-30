import type { S3, SQS } from "aws-sdk";
import { ImportProvider } from "./importProvider";

type Services = {
  s3: S3;
  sqs: SQS;
};
type Env = {
  FIXTURES_BUCKET: string;
  IMPORTED_PRODUCTS_QUEUE: string;
};

export class AWSImportProvider implements ImportProvider {
  private s3: S3;
  private sqs: SQS;
  constructor(services: Services, private env: Env) {
    this.s3 = services.s3;
    this.sqs = services.sqs;
  }

  getSignedUrl(name: string) {
    return this.s3.getSignedUrlPromise("putObject", {
      Bucket: this.env.FIXTURES_BUCKET,
      Key: name,
      Expires: 60,
      ContentType: "text/csv",
    });
  }

  getReadStream(name: string) {
    return this.s3
      .getObject({
        Bucket: this.env.FIXTURES_BUCKET,
        Key: name,
      })
      .createReadStream();
  }

  async moveFile(from: string, to: string) {
    await this.s3
      .copyObject({
        Bucket: this.env.FIXTURES_BUCKET,
        CopySource: `${this.env.FIXTURES_BUCKET}/${from}`,
        Key: to,
      })
      .promise();
    await this.s3
      .deleteObject({ Bucket: this.env.FIXTURES_BUCKET, Key: from })
      .promise();
  }

  notifyProduct(product: unknown) {
    this.sqs
      .sendMessage({
        QueueUrl: this.env.IMPORTED_PRODUCTS_QUEUE,
        MessageBody: JSON.stringify(product),
      })
      .promise();
    return;
  }
}
