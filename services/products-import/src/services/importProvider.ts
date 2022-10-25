import { MaybePromise } from "@guria.dev/aws-js-practitioner-commons/types";

export interface ImportProvider {
  getSignedUrl: (name: string) => MaybePromise<string>;
}
