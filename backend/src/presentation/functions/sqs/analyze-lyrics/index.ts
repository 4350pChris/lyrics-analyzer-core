import {handlerPath} from '../../../libs/handler-resolver';

const functionObject = {
	handler: `${handlerPath(__dirname)}/handler.main`,
};

export default functionObject;
