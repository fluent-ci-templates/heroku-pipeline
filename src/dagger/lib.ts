import Client, {
  Directory,
  DirectoryID,
  Secret,
  SecretID,
} from "../../deps.ts";

export const getDirectory = (
  client: Client,
  src: string | Directory | undefined = "."
) => {
  if (typeof src === "string" && src.startsWith("core.Directory")) {
    return client.directory({
      id: src as DirectoryID,
    });
  }
  return src instanceof Directory ? src : client.host().directory(src);
};

export const getHerokuApiKey = (client: Client, token?: string | Secret) => {
  if (Deno.env.get("HEROKU_API_KEY")) {
    return client.setSecret("HEROKU_API_KEY", Deno.env.get("HEROKU_API_KEY")!);
  }
  if (token && typeof token === "string") {
    if (token.startsWith("core.Secret")) {
      return client.loadSecretFromID(token as SecretID);
    }
    return client.setSecret("HEROKU_API_KEY", token);
  }
  if (token && token instanceof Secret) {
    return token;
  }
  return undefined;
};
