import { parse, stringify } from "yaml";

export function prettyJson(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2);
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

export function prettyYaml(input: string): string {
  return stringify(parse(input));
}

export function minifyYaml(input: string): string {
  return stringify(parse(input), { collectionStyle: "flow" }).trim();
}

export function jsonToYaml(input: string): string {
  return stringify(JSON.parse(input));
}

export function yamlToJson(input: string, pretty = true): string {
  return JSON.stringify(parse(input), null, pretty ? 2 : 0);
}

export function validateJson(input: string): void {
  JSON.parse(input);
}

export function validateYaml(input: string): void {
  parse(input);
}
