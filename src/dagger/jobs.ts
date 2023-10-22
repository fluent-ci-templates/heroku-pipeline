import { connect } from "../../deps.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

export const deploy = async (src = ".", apiKey?: string, appName?: string) => {
  await connect(async (client) => {
    const context = client.host().directory(src);

    if (!Deno.env.get("HEROKU_API_KEY") && !apiKey) {
      console.log("HEROKU_API_KEY not set");
      Deno.exit(1);
    }

    if (!Deno.env.get("HEROKU_APP_NAME") && !appName) {
      console.log("HEROKU_APP_NAME not set");
      Deno.exit(1);
    }

    const ctr = client
      .pipeline(Job.deploy)
      .container()
      .from("ruby:2.7.8-alpine3.16")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "nodejs", "git", "make", "gcc", "g++"])
      .withExec(["gem", "install", "dpl", "--pre"])
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withEnvVariable(
        "HEROKU_API_KEY",
        Deno.env.get("HEROKU_API_KEY") || apiKey!
      )
      .withEnvVariable(
        "HEROKU_APP_NAME",
        Deno.env.get("HEROKU_APP_NAME") || appName!
      )
      .withExec([
        "sh",
        "-c",
        "dpl heroku api --app $HEROKU_APP_NAME --api_key $HEROKU_API_KEY",
      ]);
    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export type JobExec = (
  src?: string,
  apiKey?: string,
  appName?: string
) =>
  | Promise<string>
  | ((
      src?: string,
      apiKey?: string,
      appName?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Heroku",
};
