# Heroku Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fheroku_pipeline&query=%24.version)](https://pkg.fluentci.io/heroku_pipeline)
[![deno module](https://shield.deno.dev/x/heroku_pipeline)](https://deno.land/x/heroku_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/heroku-pipeline)](https://codecov.io/gh/fluent-ci-templates/heroku-pipeline)

A ready-to-use CI/CD Pipeline for deploying your applications to [Heroku](https://www.heroku.com).

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci heroku_pipeline
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

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/heroku_pipeline/mod.ts";

const { deploy } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await deploy(client, src);
  });
}

pipeline();

```
