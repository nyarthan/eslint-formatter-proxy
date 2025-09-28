<p align="center">
  <!-- <img src="https://raw.githubusercontent.com/prettier/prettier-logo/refs/heads/master/images/prettier-wide-dark.svg" /> -->
  <h1 align="center">eslint-formatter-proxy</h1>
</p>

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/eslint-formatter-proxy?style=for-the-badge&logo=npm&logoColor=%23fff&label=npm&labelColor=cd0000&color=%23fff)](https://www.npmjs.com/eslint-formatter-proxy)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/nyarthan/eslint-formatter-proxy/ci.yaml?branch=master&style=for-the-badge&logo=github&logoColor=%23fff&label=CI&labelColor=%23151b23)](https://github.com/nyarthan/eslint-formatter-proxy/actions/workflows/ci.yaml)
[![GitHub License](https://img.shields.io/github/license/nyarthan/eslint-formatter-proxy?style=for-the-badge&labelColor=%23151b23&color=%23f0f6fc)](./LICENSE)

</div>

## Installation

```sh
pnpm add -D eslint-formatter-proxy
```

## Configuration

ESLint does not provide a way to pass settings to custom formatters. So we have to use an environment variable.

Set `ESLINT_FORMATTER_PROXY` to you configuration.

It expects a list of names, or name-options tuples.
Currently the only option is `outFile` which writes the result to disk instead of stdout.

```sh
ESLINT_FORMATTER_PROXY='["stylish", ["json", {"outFile": "./eslint.json"}]]' eslint -f eslint-formatter-proxy
#                            │          │         │            │
#                            │          │         │            └─ Write to <cwd>/eslint.json
#                            │          │         │
#                            │          │         └────────────── Write to file instead of stdout
#                            │          │
#                            │          └──────────────────────── Use builtin "json" formatter
#                            │
#                            └─────────────────────────────────── Use the builtin "stylish" formatter to print to stdout
```
