import { Client } from "@dagger.io/dagger";

export enum Job {
  deploy = "deploy",
}

export const deploy = async (client: Client, src = ".") => {
  const context = client.host().directory(src);

  if (!Deno.env.get("HEROKU_API_KEY")) {
    console.log("HEROKU_API_KEY not set");
    Deno.exit(1);
  }

  if (!Deno.env.get("HEROKU_APP_NAME")) {
    console.log("HEROKU_APP_NAME not set");
    Deno.exit(1);
  }

  const ctr = client
    .pipeline(Job.deploy)
    .container()
    .from("ruby:2.7.8-alpine3.16")
    .withExec(["apk", "update"])
    .withExec(["apk", "add", "nodejs", "git"])
    .withExec(["gem", "install", "dpl", "--pre"])
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withEnvVariable("HEROKU_API_KEY", Deno.env.get("HEROKU_API_KEY")!)
    .withEnvVariable("HEROKU_APP_NAME", Deno.env.get("HEROKU_APP_NAME")!)
    .withExec([
      "sh",
      "-c",
      "dpl heroku api --app $HEROKU_APP_NAME --api_key $HEROKU_API_KEY",
    ]);
  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Heroku",
};
