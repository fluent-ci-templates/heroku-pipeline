import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("Deploy");

  const push = {
    branches: ["main"],
  };

  const setupDagger = `\
  curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.8.1 sh
  sudo mv bin/dagger /usr/local/bin
  dagger version`;

  const deploy: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        uses: "denolib/setup-deno@v2",
        with: {
          "deno-version": "v1.36",
        },
      },
      {
        name: "Setup Fluent CI CLI",
        run: "deno install -A -r https://cli.fluentci.io -n fluentci",
      },
      {
        name: "Setup Dagger",
        run: setupDagger,
      },
      {
        name: "Run Dagger Pipelines",
        run: "dagger run fluentci heroku_pipeline",
        env: {
          HEROKU_API_KEY: "${{ secrets.HEROKU_API_KEY }}",
          HEROKU_APP_NAME: "${{ secrets.HEROKU_APP_NAME }}",
        },
      },
    ],
  };

  workflow.on({ push }).jobs({ deploy });

  return workflow;
}
