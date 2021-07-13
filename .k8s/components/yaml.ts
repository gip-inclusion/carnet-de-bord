import env from "@kosko/env";
import { importYamlFolder } from "@socialgouv/kosko-charts/components/yaml";
import { updateMetadata } from "@socialgouv/kosko-charts/utils/updateMetadata";
import environments from "@socialgouv/kosko-charts/environments";
import path from "path";

const getManifests = async () => {
  const manifests = await importYamlFolder(
    path.join(__dirname, "..", `environments/${env.env}/yaml`)
  );

  const ciEnv = environments(process.env);

  // add gitlab annotations
  manifests.forEach((manifest) =>
    //@ts-expect-error
    updateMetadata(manifest, {
      annotations: ciEnv.metadata.annotations ?? {},
      labels: ciEnv.metadata.labels ?? {},
      namespace: ciEnv.metadata.namespace,
    })
  );

  return manifests;
};

export default getManifests;
