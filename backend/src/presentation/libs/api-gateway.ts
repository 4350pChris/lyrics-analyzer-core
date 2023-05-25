/* eslint-disable @typescript-eslint/naming-convention */
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import validator from '@middy/validator';
import {transpileSchema} from '@middy/validator/transpile';
import type {APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import httpErrorHandler from '@middy/http-error-handler';
import {type DependencyAwareContext, withDependencies} from './with-dependencies';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters'> & {
	body: S;
	queryStringParameters: APIGatewayProxyEventQueryStringParameters;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = (event: ValidatedAPIGatewayProxyEvent<S>, context: DependencyAwareContext) => Promise<APIGatewayProxyResultV2>;

export const formatJSONResponse = (response: Record<string, unknown>, statusCode?: number) => ({
	statusCode: statusCode ?? 200,
	body: JSON.stringify(response),
});

export const middyfyGatewayHandler = <Schema, Body>(handler: ValidatedEventAPIGatewayProxyEvent<Body>, requestSchema?: Schema) => {
	const wrapper = middy(handler)
		.use(httpErrorHandler())
		.use(httpJsonBodyParser())
		.use(httpEventNormalizer())
		.use(withDependencies());

	if (requestSchema) {
		wrapper.use(
			validator({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				eventSchema: transpileSchema({
					type: 'object',
					properties: {
						body: requestSchema,
					},
					required: ['body'],
				}),
			}),
		);
	}

	return wrapper;
};
