import { MaybePromise } from "@guria.dev/aws-js-practitioner-commons/types";

export interface ImportProvider {
  getSignedUrl: (name: string) => MaybePromise<string>;
  getReadStream: (name: string) => NodeJS.ReadableStream;
  moveFile: (from: string, to: string) => MaybePromise<void>;
  notifyProduct: (product: unknown) => MaybePromise<void>;
}
