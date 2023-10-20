import { gql } from "../../deps.ts";

export const deploy = gql`
  query deploy($src: String!, $apiKey: String!, $appName: String!) {
    deploy(src: $src, apiKey: $apiKey, appName: $appName)
  }
`;
