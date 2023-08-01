/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-template-curly-in-string */
import type {AWS} from '@serverless/typescript';
import type {Lift} from 'serverless-lift';
import {parseLyrics, fetchSongs, analyzeLyrics} from './src/presentation/functions/sqs';
import {listArtists, pingEndpoint, triggerWorkflow, searchArtists} from './src/presentation/functions/http';
import {type TriggerWorkflowEvent} from '@/application/events/trigger-workflow.event';
import {type FetchedSongsEvent} from '@/application/events/fetched-songs.event';
import {type ParsedLyricsEvent} from '@/application/events/parsed-lyrics.event';

const serverlessConfiguration: AWS & Lift = {
	org: '4350pchris',
	app: 'lyrics-analyzer',
	service: 'backend',
	frameworkVersion: '3',
	useDotenv: true,
	plugins: [
		'serverless-esbuild',
		'serverless-offline',
		'serverless-lift',
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
			INTEGRATION_EVENT_TOPIC_ARN: {
				Ref: 'IntegrationEventTopic',
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
						Action: ['sns:Publish'],
						Resource: {
							Ref: 'IntegrationEventTopic',
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
						ReadCapacityUnits: 10,
						WriteCapacityUnits: 10,
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
			IntegrationEventTopic: {
				Type: 'AWS::SNS::Topic',
				Properties: {
					TopicName: '${self:service}-IntegrationEvent-${sls:stage}',
				},
			},
			FetchSongsSubscription: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Endpoint: '${construct:fetchSongsQueue.queueArn}',
					Protocol: 'sqs',
					TopicArn: {
						Ref: 'IntegrationEventTopic',
					},
					FilterPolicy: {
						eventType: ['triggerWorkflow' satisfies TriggerWorkflowEvent['eventType']],
					},
				},
			},
			ParseLyricsSubscription: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Endpoint: '${construct:parseLyricsQueue.queueArn}',
					Protocol: 'sqs',
					TopicArn: {
						Ref: 'IntegrationEventTopic',
					},
					FilterPolicy: {
						eventType: ['fetchedSongs' satisfies FetchedSongsEvent['eventType']],
					},
				},
			},
			AnalyzeSongsSubscription: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Endpoint: '${construct:analysisQueue.queueArn}',
					Protocol: 'sqs',
					TopicArn: {
						Ref: 'IntegrationEventTopic',
					},
					FilterPolicy: {
						eventType: ['parsedLyrics' satisfies ParsedLyricsEvent['eventType']],
					},
				},
			},
			IntegrationEventPublishPermission: {
				Type: 'AWS::SQS::QueuePolicy',
				Properties: {
					PolicyDocument: {
						Version: '2012-10-17',
						Statement: [
							{
								Effect: 'Allow',
								Principal: {
									Service: 'sns.amazonaws.com',
								},
								Action: 'sqs:SendMessage',
								Resource: '*',
								Condition: {
									ArnEquals: {
										'aws:SourceArn': {Ref: 'IntegrationEventTopic'},
									},
								},
							},
						],
					},
					Queues: [
						'${construct:fetchSongsQueue.queueUrl}',
						'${construct:parseLyricsQueue.queueUrl}',
						'${construct:analysisQueue.queueUrl}',
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
