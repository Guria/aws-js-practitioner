import type { S3CreateEvent } from "aws-lambda/trigger/s3";
import type { ImportService } from "services/import";

export async function handler(
  importService: ImportService,
  event: S3CreateEvent
) {
  for (const record of event.Records) {
    await importService.importProductsFile(record.s3.object.key);
  }
}
