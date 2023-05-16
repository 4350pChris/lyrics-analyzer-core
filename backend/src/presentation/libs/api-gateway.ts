/* eslint-disable @typescript-eslint/naming-convention */
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import {transpileSchema} from '@middy/validator/transpile';
import type {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import {type DependencyAwareContext, withDependencies} from './with-dependencies';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEventV2, 'body'> & {body: S};
export type ValidatedEventAPIGatewayProxyEvent<S> = (event: ValidatedAPIGatewayProxyEvent<S>, context: DependencyAwareContext) => Promise<APIGatewayProxyResultV2>;

export const formatJSONResponse = (response: Record<string, unknown>) => ({
	statusCode: 200,
	body: JSON.stringify(response),
});

export const middyfyGatewayHandler = <Schema, Body>(handler: ValidatedEventAPIGatewayProxyEvent<Body>, requestSchema?: Schema) => {
	const wrapper = middy(handler).use(httpJsonBodyParser()).use(withDependencies());

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
