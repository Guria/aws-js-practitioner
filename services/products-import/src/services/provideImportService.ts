import { S3 } from "aws-sdk";
import { middyfy } from "@guria.dev/aws-js-practitioner-commons/middy";
import { ImportService } from "services/import";
import { S3ImportProvider } from "services/importProvider.s3";
import * as env from "env";

const importService = new ImportService(
  new S3ImportProvider(new S3({ signatureVersion: "v4" }), env.FIXTURES_BUCKET)
);

export type ImportServiceFunctionHandler = (
  productsService: ImportService,
  event: unknown,
  context: unknown
) => Promise<unknown>;

export function provideImportService(handler: ImportServiceFunctionHandler) {
  return middyfy(handler.bind(null, importService), env);
}
