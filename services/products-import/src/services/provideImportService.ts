import { S3, SQS } from "aws-sdk";
import {
  middyfyGatewayHandler,
  middyfySimpleHandler,
} from "@guria.dev/aws-js-practitioner-commons/middy";
import { ImportService } from "services/import";
import { AWSImportProvider } from "services/importProvider.aws";
import * as env from "env";

const importService = new ImportService({
  importProvider: new AWSImportProvider(
    {
      s3: new S3({ signatureVersion: "v4" }),
      sqs: new SQS({}),
    },
    env
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
