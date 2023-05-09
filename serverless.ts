/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-template-curly-in-string */
import type {AWS} from '@serverless/typescript';
import type {Lift} from 'serverless-lift';
import {analyzeLyrics, parseLyrics} from './src/presentation/functions/index';

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
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: ['dynamodb:PutItem', 'dynamodb:Get*', 'dynamodb:Scan*', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
						Resource: 'arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-Artist-${sls:stage}',
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
		},
	},
	constructs: {
		'song-chunk-queue': {
			type: 'queue',
			worker: parseLyrics,
		},
	},
	// Import the function via paths
	functions: {
		analyzeLyrics: {
			...analyzeLyrics,
			environment: {
				QUEUE_URL: '${construct:song-chunk-queue.queueUrl}',
			},
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
