import Client, {
  Directory,
  DirectoryID,
  Secret,
  SecretID,
} from "../../deps.ts";

export const getDirectory = async (
  client: Client,
  src: string | Directory | undefined = "."
) => {
  if (typeof src === "string") {
    try {
      const directory = client.loadDirectoryFromID(src as DirectoryID);
      await directory.id();
      return directory;
    } catch (_) {
      return client.host().directory(src);
    }
  }
  return src instanceof Directory ? src : client.host().directory(src);
};

export const getHerokuApiKey = async (
  client: Client,
  token?: string | Secret
) => {
  if (Deno.env.get("HEROKU_API_KEY")) {
    return client.setSecret("HEROKU_API_KEY", Deno.env.get("HEROKU_API_KEY")!);
  }
  if (token && typeof token === "string") {
    try {
      const secret = client.loadSecretFromID(token as SecretID);
      await secret.id();
      return secret;
    } catch (_) {
      return client.setSecret("HEROKU_API_KEY", token);
    }
  }
  if (token && token instanceof Secret) {
    return token;
  }
  return undefined;
};
