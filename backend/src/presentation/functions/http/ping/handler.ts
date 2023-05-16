import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, middyfyGatewayHandler} from '../../../libs/api-gateway';

const handler: ValidatedEventAPIGatewayProxyEvent<never> = async () => formatJSONResponse({
	message: 'pong',
});

export const main = middyfyGatewayHandler(handler);

