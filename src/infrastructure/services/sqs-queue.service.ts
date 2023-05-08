/* eslint-disable @typescript-eslint/naming-convention */
import type {SQS} from 'aws-sdk';
import {type Queue} from '@/application/interfaces/queue.interface';

export class SqsQueueService implements Queue {
	constructor(
		private readonly sqs: SQS,
		private readonly queueName: string,
	) {}

	async publish(message: any): Promise<void> {
		const parameters = {
			MessageBody: JSON.stringify(message),
			QueueUrl: this.queueName,
		};
		await this.sqs.sendMessage(parameters).promise();
	}
}
