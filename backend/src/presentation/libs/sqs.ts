/* eslint-disable @typescript-eslint/naming-convention */
import {type SNSMessage, type SQSRecord} from 'aws-lambda';
import middy from '@middy/core';
import validator from '@middy/validator';
import {transpileSchema} from '@middy/validator/transpile';
import sqsJsonBodyParser from '@middy/sqs-json-body-parser';
import errorLoggerMiddleware from '@middy/error-logger';
import inputOutputLoggerMiddleware from '@middy/input-output-logger';
import eventNormalizer from '@middy/event-normalizer';
import {type DependencyAwareContext, withDependencies} from './with-dependencies';

type ValidatedSNSMessage<S> = Omit<SNSMessage, 'Message'> & {Message: S};
type ValidatedSQSEvent<S> = {Records: Array<Omit<SQSRecord, 'body'> & {body: ValidatedSNSMessage<S>}>};
export type ValidatedEventSQSEvent<S> = (event: ValidatedSQSEvent<S>, context: DependencyAwareContext) => Promise<void>;

export const middyfySqsHandler = <Schema, Body>(handler: ValidatedEventSQSEvent<Body>, requestSchema?: Schema) => {
	const wrapper = middy(handler)
		.use(inputOutputLoggerMiddleware())
		.use(errorLoggerMiddleware())
		.use(eventNormalizer())
		.use(sqsJsonBodyParser())
		.use(withDependencies());

	if (requestSchema) {
		wrapper.use(
			validator({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				eventSchema: transpileSchema({
					type: 'object',
					properties: {
						Records: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									body: {
										type: 'object',
										properties: {
											Message: requestSchema,
										},
										required: ['Message'],
									},
								},
								required: ['body'],
							},
						},
					},
					required: ['Records'],
				}),
			}),
		);
	}

	return wrapper;
};
