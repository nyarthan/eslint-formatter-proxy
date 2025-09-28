import type { ESLint } from "eslint";

import * as fsp from "node:fs/promises";
import * as module from "node:module";
import * as path from "node:path";
import * as url from "node:url";

const eslintModulePath = path.dirname(
  url.fileURLToPath(import.meta.resolve("eslint/package.json")),
);

const require = module.createRequire(import.meta.url);

type Formatter = (
  results: Array<ESLint.LintResult>,
  context: ESLint.LintResultData,
) => string | Promise<string>;

type FormatterConfig = {
  name: string;
  options?: FormatterConfigOptions;
};

type FormatterConfigOptions = {
  outFile?: string;
};

export default async function formatterProxy(
  results: Array<ESLint.LintResult>,
  context: ESLint.LintResultData,
): Promise<string> {
  const formatterConfigs = getFormatterConfigs();

  const formattingResults = await Promise.all(
    formatterConfigs.map(async (formatterConfig) => {
      const formatter = await resolveFormatter(formatterConfig.name);
      const formattingResult = await formatter(
        structuredClone(results),
        structuredClone(context),
      );

      if (formatterConfig.options?.outFile) {
        await fsp.writeFile(
          formatterConfig.options.outFile,
          formattingResult,
          "utf8",
        );
      } else {
        return formattingResult;
      }
    }),
  );

  return formattingResults.filter(Boolean).join("\n\n====================\n\n");
}

function getFormatterConfigs(): Array<FormatterConfig> {
  const setting = process.env.ESLINT_FORMATTER_PROXY;
  if (typeof setting !== "string")
    throw new Error(
      "[eslint-formatter-proxy]: Environment variable ESLINT_FORMATTER_PROXY must be set.",
    );

  const rawFormatterConfigs = JSON.parse(setting) as Array<
    string | [string] | [string, { outFile?: string }]
  >;
  if (rawFormatterConfigs.length < 1)
    throw new Error(
      "[eslint-formatter-proxy]: At least one formatter must be specified.",
    );

  const formatterConfigs = rawFormatterConfigs.map((rawFormatterConfig) => {
    if (typeof rawFormatterConfig === "string")
      return { name: rawFormatterConfig };

    const [name, options] = rawFormatterConfig;
    return { name, options };
  });

  return formatterConfigs;
}

async function resolveFormatter(formatter: string): Promise<Formatter> {
  switch (formatter) {
    case "html":
      return require(`${eslintModulePath}/lib/cli-engine/formatters/html`);
    case "json-with-metadata":
      return require(
        `${eslintModulePath}/lib/cli-engine/formatters/json-with-metadata`,
      );
    case "json":
      return require(`${eslintModulePath}/lib/cli-engine/formatters/json`);
    case "stylish":
      return require(`${eslintModulePath}/lib/cli-engine/formatters/stylish`);
    default:
      return require(formatter);
  }
}
