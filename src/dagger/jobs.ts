import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory, getHerokuApiKey } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

/**
 * @function
 * @description Deploy to Heroku
 * @param {Directory | string} src The directory to deploy
 * @param {Secret | string} apiKey The Heroku API key
 * @param {string} appName The Heroku app name
 * @returns {Promise<string>}
 */
export async function deploy(
  src: Directory | string,
  apiKey: Secret | string,
  appName: string
): Promise<string> {
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const secret = getHerokuApiKey(client, apiKey);
    if (!secret) {
      console.error("HEROKU_API_KEY not set");
      Deno.exit(1);
    }

    if (!Deno.env.get("HEROKU_APP_NAME") && !appName) {
      console.error("HEROKU_APP_NAME not set");
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
      .withSecretVariable("HEROKU_API_KEY", secret)
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
}

export type JobExec = (
  src: Directory | string,
  apiKey: Secret | string,
  appName: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Heroku",
};
