import { BuildSpec } from "fluent_aws_codepipeline";

export function generateYaml(): BuildSpec {
  const buildspec = new BuildSpec();
  buildspec
    .env({
      "secrets-manager": {
        HEROKU_API_KEY: "heroku:HEROKU_API_KEY",
        HEROKU_APP_NAME: "heroku:HEROKU_APP_NAME",
      },
    })
    .phase("install", {
      commands: [
        "curl -fsSL https://deno.land/x/install/install.sh | sh",
        'export DENO_INSTALL="$HOME/.deno"',
        'export PATH="$DENO_INSTALL/bin:$PATH"',
        "deno install -A -r https://cli.fluentci.io -n fluentci",
        "curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.8.1 sh",
        "mv bin/dagger /usr/local/bin",
        "dagger version",
      ],
    })
    .phase("build", {
      commands: ["dagger run fluentci heroku_pipeline"],
    })
    .phase("post_build", {
      commands: ["echo Build completed on `date`"],
    });
  return buildspec;
}