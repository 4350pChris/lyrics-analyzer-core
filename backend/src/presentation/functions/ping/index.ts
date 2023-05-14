import {handlerPath} from '../../libs/handler-resolver';

const functionObject = {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'get',
				path: 'ping',
			},
		},
	],
};

export default functionObject;
