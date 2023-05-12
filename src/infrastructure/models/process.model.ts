import dynamoose from 'dynamoose';
import {Item} from 'dynamoose/dist/Item';

const processSchema = new dynamoose.Schema(
	{
		id: {
			type: Number,
			hashKey: true,
		},
		total: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export class ProcessModelItem extends Item {
	id!: number;
	total!: number;
}

export const getProcessModel = (processTableName: string) => dynamoose.model<ProcessModelItem>(processTableName, processSchema, {
	create: false,
	waitForActive: false,
});
