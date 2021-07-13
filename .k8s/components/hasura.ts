import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/hasura";
// import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";
import environments from "@socialgouv/kosko-charts/environments";
// import type { Manifests } from "../types/config";
// import type { IIoK8sApimachineryPkgApisMetaV1ObjectMeta } from "kubernetes-models/_definitions/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

declare type Manifests = Promise<{ kind: string }[] | []>;

// declare type Manifest =
//   | {
//       metadata?: IIoK8sApimachineryPkgApisMetaV1ObjectMeta | undefined;
//       spec?: unknown;
//     }
//   | undefined;

// import Config from "../utils/config";

export default async (): Manifests => {
  // const { name, hasura } = await Config();
  const hasura = "exposed";

  const ciEnv = environments(process.env);

  const config = {
    config: { ingress: hasura === "exposed" },
    deployment: {
      image: `ghcr.io/socialgouv/carnet-de-bord/hasura:sha-${ciEnv.sha}`,
    },
    env,
  };

  if (hasura) {
    const manifests = await create("hasura", config);
    return manifests;
  } else {
    return Promise.resolve([]);
  }
};
