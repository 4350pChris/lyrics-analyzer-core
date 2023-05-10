import dynamoose from 'dynamoose';
import {Item} from 'dynamoose/dist/Item';

const processSchema = new dynamoose.Schema(
	{
		id: {
			type: String,
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
	id!: string;
	total!: number;
}

export const getProcessModel = (processTableName: string) => dynamoose.model<ProcessModelItem>(processTableName, processSchema, {
	create: false,
	waitForActive: false,
});
