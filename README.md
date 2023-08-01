# Lyrics Analyzer Core

[![codecov](https://codecov.io/github/4350pChris/lyrics-analyzer-core/branch/main/graph/badge.svg?token=P690FL0K43)](https://codecov.io/github/4350pChris/lyrics-analyzer-core)

![coverage-graph](https://codecov.io/github/4350pChris/lyrics-analyzer-core/branch/main/graphs/sunburst.svg?token=P690FL0K43)

## Coverage report

[coverage report is deployed to gh pages](https://4350pchris.github.io/lyrics-analyzer-core/)

## Setup

You'll need an AWS account to set this up as well as the AWS and Serverless cli downloaded and configured.

To deploy the basic stack run `sls deploy` from this directory.

To build the website you'll need to run `sls frontend:client build` followed by `sls frontend:client deploy`.

## Local Development

For local development you'll want to deploy the stack once to get DynamoDB and the messaging queue going.
After that you can redeploy your functions or invoke them locally using the sls cli.
For information on how to do that see the Serverless docs.
