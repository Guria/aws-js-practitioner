import type { S3 } from "aws-sdk";
import { ImportProvider } from "./importProvider";

export class S3ImportProvider implements ImportProvider {
  constructor(private bucketName: string, private s3: S3) {}

  getSignedUrl(name: string) {
    return this.s3.getSignedUrlPromise("putObject", {
      Bucket: this.bucketName,
      Key: name,
      Expires: 60,
      ContentType: "text/csv",
    });
  }

  getReadStream(name: string) {
    return this.s3
      .getObject({
        Bucket: this.bucketName,
        Key: name,
      })
      .createReadStream();
  }

  async moveFile(from: string, to: string) {
    await this.s3
      .copyObject({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${from}`,
        Key: to,
      })
      .promise();
    await this.s3
      .deleteObject({ Bucket: this.bucketName, Key: from })
      .promise();
  }
}
