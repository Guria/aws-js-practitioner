import type { S3 } from "aws-sdk";
import { ImportProvider } from "./importProvider";

export class S3ImportProvider implements ImportProvider {
  constructor(private s3: S3, private bucketName: string) {}

  getSignedUrl(name: string) {
    return this.s3.getSignedUrlPromise("putObject", {
      Bucket: this.bucketName,
      Key: name,
      Expires: 60,
      ContentType: "text/csv",
    });
  }
}
