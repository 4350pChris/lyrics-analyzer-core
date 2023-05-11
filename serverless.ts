/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-template-curly-in-string */
import type {AWS} from '@serverless/typescript';
import type {Lift} from 'serverless-lift';
import {triggerWorkflow, parseLyrics, fetchSongs} from './src/presentation/functions/index';

const serverlessConfiguration: AWS & Lift = {
	org: '4350pchris',
	app: 'lyrics-backend',
	service: 'lyrics-backend',
	frameworkVersion: '3',
	useDotenv: true,
	plugins: [
		'serverless-esbuild',
		'serverless-lift',
		'serverless-offline',
	],
	provider: {
		name: 'aws',
		runtime: 'nodejs16.x',
		deploymentMethod: 'direct',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			GENIUS_ACCESS_TOKEN: '${env:GENIUS_ACCESS_TOKEN}',
			ARTIST_TABLE_NAME: '${self:service}-Artist-${sls:stage}',
			PROCESS_TABLE_NAME: '${self:service}-Process-${sls:stage}',
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: ['dynamodb:PutItem', 'dynamodb:Get*', 'dynamodb:Scan*', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
						Resource: 'arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-*-${sls:stage}',
					},
				],
			},
		},
	},
	resources: {
		Resources: {
			ArtistTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:service}-Artist-${sls:stage}',
					BillingMode: 'PAY_PER_REQUEST',
					AttributeDefinitions: [
						{
							AttributeName: 'id',
							AttributeType: 'S',
						},
					],
					KeySchema: [
						{
							AttributeName: 'id',
							KeyType: 'HASH',
						},
					],
				},
			},
			ProcessTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:service}-Process-${sls:stage}',
					BillingMode: 'PAY_PER_REQUEST',
					AttributeDefinitions: [
						{
							AttributeName: 'id',
							AttributeType: 'S',
						},
					],
					KeySchema: [
						{
							AttributeName: 'id',
							KeyType: 'HASH',
						},
					],
				},
			},
		},
	},
	constructs: {
		'fetch-songs-queue': {
			type: 'queue',
			worker: {
				handler: fetchSongs.handler,
				environment: {
					QUEUE_URL: '${construct:parse-songs-queue.queueUrl}',
				},
				timeout: 30,
				logRetentionInDays: 14,
			},
		},
		'parse-songs-queue': {
			type: 'queue',
			worker: {
				handler: parseLyrics.handler,
				environment: {
					QUEUE_URL: '${construct:parse-songs-queue.queueUrl}',
				},
				timeout: 30,
				logRetentionInDays: 14,
			},
		},
	},
	// Import the function via paths
	functions: {
		triggerWorkflow: {
			...triggerWorkflow,
			environment: {
				QUEUE_URL: '${construct:fetch-songs-queue.queueUrl}',
			},
			memorySize: 512,
			logRetentionInDays: 14,
		},
	},
	package: {individually: true},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			platform: 'node',
			concurrency: 10,
			packager: 'pnpm',
			// By default aws-sdk is excluded, but we need it
			exclude: [],
			watch: {
				patterns: ['src/**/*.ts'],
				ignore: ['test/**/*', 'dist/**/*'],
			},
		},
	},
};

module.exports = serverlessConfiguration;
