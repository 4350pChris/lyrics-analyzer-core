import {handlerPath} from '../../libs/handler-resolver';

const functionObject = {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			httpApi: {
				method: 'GET',
				path: '/artists',
			},
		},
	],
};

export default functionObject;
