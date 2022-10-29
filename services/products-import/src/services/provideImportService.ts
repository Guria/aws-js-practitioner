import { S3 } from "aws-sdk";
import {
  middyfyGatewayHandler,
  middyfySimpleHandler,
} from "@guria.dev/aws-js-practitioner-commons/middy";
import { ImportService } from "services/import";
import { S3ImportProvider } from "services/importProvider.s3";
import * as env from "env";

const importService = new ImportService({
  importProvider: new S3ImportProvider(
    env.FIXTURES_BUCKET,
    new S3({ signatureVersion: "v4" })
  ),
});

export type ImportServiceFunctionHandler = (
  productsService: ImportService,
  event: unknown,
  context: unknown
) => Promise<unknown>;

export function provideImportService(handler: ImportServiceFunctionHandler) {
  return middyfyGatewayHandler(handler.bind(null, importService), env);
}

export function provideImportServiceS3(handler: ImportServiceFunctionHandler) {
  return middyfySimpleHandler(handler.bind(null, importService));
}
