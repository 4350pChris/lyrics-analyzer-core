/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-template-curly-in-string */
import type {AWS} from '@serverless/typescript';
import type {Lift} from 'serverless-lift';
import {triggerWorkflow, parseLyrics, fetchSongs, analyzeLyrics} from './backend/src/presentation/functions/index';

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
			FETCH_SONGS_QUEUE_URL: '${construct:fetchSongsQueue.queueUrl}',
			PARSE_LYRICS_QUEUE_URL: '${construct:parseLyricsQueue.queueUrl}',
			ANALYSIS_QUEUE_URL: '${construct:analysisQueue.queueUrl}',
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
					ProvisionedThroughput: {
						ReadCapacityUnits: 3,
						WriteCapacityUnits: 3,
					},
					AttributeDefinitions: [
						{
							AttributeName: 'id',
							AttributeType: 'N',
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
					ProvisionedThroughput: {
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
					AttributeDefinitions: [
						{
							AttributeName: 'id',
							AttributeType: 'N',
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
		fetchSongsQueue: {
			type: 'queue',
			worker: {
				handler: fetchSongs.handler,
				timeout: 30,
				logRetentionInDays: 14,
			},
		},
		parseLyricsQueue: {
			type: 'queue',
			worker: {
				handler: parseLyrics.handler,
				timeout: 30,
				logRetentionInDays: 14,
			},
		},
		analysisQueue: {
			type: 'queue',
			worker: {
				handler: analyzeLyrics.handler,
				logRetentionInDays: 14,
				timeout: 30,
			},
		},
	},
	// Import the function via paths
	functions: {
		triggerWorkflow: {
			...triggerWorkflow,
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
			watch: {
				patterns: ['src/**/*.ts'],
				ignore: ['test/**/*', 'dist/**/*'],
			},
		},
	},
};

module.exports = serverlessConfiguration;
