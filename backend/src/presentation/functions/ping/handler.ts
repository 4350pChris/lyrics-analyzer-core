import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../libs/api-gateway';

const handler: ValidatedEventAPIGatewayProxyEvent<never> = async () => formatJSONResponse({
	message: 'pong',
});

export const main = middy(handler).use(httpJsonBodyParser()).use(cors());

