/* eslint-disable @typescript-eslint/naming-convention */
import {type SQSRecord} from 'aws-lambda';
import middy from '@middy/core';
import validator from '@middy/validator';
import {transpileSchema} from '@middy/validator/transpile';
import sqsJsonBodyParser from '@middy/sqs-json-body-parser';
import {type DependencyAwareContext, withDependencies} from './with-dependencies';

type ValidatedSQSEvent<S> = {Records: Array<Omit<SQSRecord, 'body'> & {body: S}>};
export type ValidatedEventSQSEvent<S> = (event: ValidatedSQSEvent<S>, context: DependencyAwareContext) => Promise<void>;

export const middyfySqsHandler = <Schema, Body>(handler: ValidatedEventSQSEvent<Body>, requestSchema?: Schema) => {
	const wrapper = middy(handler).use(sqsJsonBodyParser()).use(withDependencies());

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
									body: requestSchema,
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
