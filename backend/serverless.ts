/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-template-curly-in-string */
import type {AWS} from '@serverless/typescript';
import {parseLyrics, fetchSongs, analyzeLyrics} from './src/presentation/functions/sqs';
import {listArtists, pingEndpoint, triggerWorkflow, searchArtists} from './src/presentation/functions/http';
import {type TriggerWorkflowEvent} from '@/application/events/trigger-workflow.event';
import {type FetchedSongsEvent} from '@/application/events/fetched-songs.event';
import {type ParsedLyricsEvent} from '@/application/events/parsed-lyrics.event';

const serverlessConfiguration: AWS = {
	org: '4350pchris',
	app: 'lyrics-analyzer',
	service: 'backend',
	frameworkVersion: '3',
	useDotenv: true,
	plugins: [
		'serverless-esbuild',
		'serverless-offline',
	],
	provider: {
		name: 'aws',
		runtime: 'nodejs18.x',
		deploymentMethod: 'direct',
		httpApi: {
			cors: true,
		},
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			GENIUS_ACCESS_TOKEN: '${env:GENIUS_ACCESS_TOKEN}',
			ARTIST_TABLE_NAME: '${self:service}-Artist-${sls:stage}',
			INTEGRATION_EVENT_QUEUE_URL: {
				'Fn::GetAtt': ['IntegrationEventQueue', 'QueueUrl'],
			},
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: ['dynamodb:PutItem', 'dynamodb:Get*', 'dynamodb:Scan*', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
						Resource: 'arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-*-${sls:stage}',
					},
					{
						Effect: 'Allow',
						Action: ['sqs:*'],
						Resource: {
							'Fn::GetAtt': ['IntegrationEventQueue', 'Arn'],
						},
					},
					{
						Effect: 'Allow',
						Action: ['sqs:*'],
						Resource: {
							'Fn::GetAtt': ['IntegrationEventDeadLetterQueue', 'Arn'],
						},
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
			IntegrationEventQueue: {
				Type: 'AWS::SQS::Queue',
				Properties: {
					QueueName: '${self:service}-IntegrationEventQueue-${sls:stage}',
					MessageRetentionPeriod: 1_209_600,
					VisibilityTimeout: 60,
					RedrivePolicy: {
						deadLetterTargetArn: {
							'Fn::GetAtt': ['IntegrationEventDeadLetterQueue', 'Arn'],
						},
						maxReceiveCount: 10,
					},
				},
			},
			IntegrationEventDeadLetterQueue: {
				Type: 'AWS::SQS::Queue',
				Properties: {
					QueueName: '${self:service}-IntegrationEventDeadLetterQueue-${sls:stage}',
					MessageRetentionPeriod: 1_209_600,
				},
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
		ping: {
			...pingEndpoint,
			memorySize: 256,
			logRetentionInDays: 1,
		},
		listArtists: {
			...listArtists,
			memorySize: 512,
			logRetentionInDays: 14,
		},
		searchArtists: {
			...searchArtists,
			memorySize: 256,
			logRetentionInDays: 1,
		},
		fetchSongs: {
			...fetchSongs,
			memorySize: 512,
			logRetentionInDays: 14,
			events: [
				{
					sqs: {
						arn: {
							'Fn::GetAtt': ['IntegrationEventQueue', 'Arn'],
						},
						filterPatterns: [
							{
								body: {
									eventType: [
										{exists: true},
										{prefix: 'triggerWorkflow' satisfies TriggerWorkflowEvent['eventType']},
									],
								},
							},
						],
					},
				},
			],
		},
		parseLyrics: {
			...parseLyrics,
			memorySize: 512,
			logRetentionInDays: 14,
			events: [
				{
					sqs: {
						arn: {
							'Fn::GetAtt': ['IntegrationEventQueue', 'Arn'],
						},
						filterPatterns: [
							{
								body: {
									eventType: [
										{exists: true},
										{prefix: 'fetchedSongs' satisfies FetchedSongsEvent['eventType']},
									],
								},
							},
						],
					},
				},
			],
		},
		analyzeLyrics: {
			...analyzeLyrics,
			memorySize: 512,
			logRetentionInDays: 14,
			events: [
				{
					sqs: {
						arn: {
							'Fn::GetAtt': ['IntegrationEventQueue', 'Arn'],
						},
						filterPatterns: [
							{
								body: {
									eventType: [
										{exists: true},
										{prefix: 'parsedLyrics' satisfies ParsedLyricsEvent['eventType']},
									],
								},
							},
						],
					},
				},
			],
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
