import dynamoose from 'dynamoose';

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

export const getProcessModel = (processTableName: string) => dynamoose.model('Process', processSchema, {
	tableName: processTableName,
});
