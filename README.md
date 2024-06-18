# Heroku Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/heroku_pipeline)](https://pkg.fluentci.io/heroku_pipeline)
[![deno module](https://shield.deno.dev/x/heroku_pipeline)](https://deno.land/x/heroku_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/heroku-pipeline)](https://codecov.io/gh/fluent-ci-templates/heroku-pipeline)

A ready-to-use CI/CD Pipeline for deploying your applications to [Heroku](https://www.heroku.com).

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci heroku_pipeline
```

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger mod install github.com/fluent-ci-templates/heroku-pipeline@main
```

## Environment Variables

| Variable        | Description         |
|-----------------|---------------------|
| HEROKU_API_KEY  | Your Heroku API Key |
| HEROKU_APP_NAME | Your Heroku App     |

## Jobs

| Job     | Description                       |
|---------|-----------------------------------|
| deploy  | Deploys your application to Heroku. |

```typescript
deploy(
  src: Directory | string,
  apiKey: Secret | string,
  appName: string
): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { deploy } from "https://pkg.fluentci.io/heroku_pipeline@v0.8.0/mod.ts";

await deploy(
  ".", 
  Deno.env.get("HEROKU_API_KEY")!, 
  Deno.env.get("HEROKU_APP_NAME")!
);
```
