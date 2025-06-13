import type { AWS } from "@serverless/typescript";
import createFoundation from "@functions/create-foundation";
import addPets from "@functions/add-pets";
import getPetsByFoundation from "@functions/get-pets-by-foundation";
import deletePet from "@functions/delete-pet";

const stage = process.env.STAGE || "dev";
const cdkStackName = `api-pet-foundation-dynamo-${stage}`;

const serverlessConfiguration: AWS = {
  service: "pets",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    stage: "${opt:stage, 'dev'}",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PETS_TABLE_NAME: `\${cf:${cdkStackName}.PetsTableName}`,
    },
    iam: {
      role: `\${cf:${cdkStackName}.PetsLambdaRoleArn}`,
    },
  },
  functions: {
    createFoundation: {
      ...createFoundation,
      layers: [],
    },
    addPets: {
      ...addPets,
      layers: [],
    },
    getPetsByFoundation: {
      ...getPetsByFoundation,
      layers: [],
    },
    deletePet: {
      ...deletePet,
      layers: [],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  layers: {
    commonLayer: {
      path: "layers/common",
      name: "common-layer",
      description: "Common utilities and shared code",
      compatibleRuntimes: ["nodejs18.x"],
      retain: true,
    },
    dynamoLayer: {
      path: "layers/dynamo",
      name: "dynamo-layer",
      description: "DynamoDB utilities and shared code",
      compatibleRuntimes: ["nodejs18.x"],
      retain: true,
    },
  },
};

module.exports = serverlessConfiguration;
