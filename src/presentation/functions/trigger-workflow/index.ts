import {handlerPath} from '../../libs/handler-resolver';
import schema from './schema';

const functionObject = {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'post',
				path: 'trigger-workflow',
				request: {
					schemas: {
						// eslint-disable-next-line @typescript-eslint/naming-convention
						'application/json': schema,
					},
				},
			},
		},
	],
};

export default functionObject;
