/* eslint-disable @typescript-eslint/naming-convention */
import type {SQS} from 'aws-sdk';
import {type Queue} from '@/application/interfaces/queue.interface.js';

export class SqsQueueService implements Queue {
	constructor(
		private readonly sqs: SQS,
		private readonly queueUrl: string,
	) {}

	async publish(message: string): Promise<void> {
		const parameters = {
			MessageBody: message,
			QueueUrl: this.queueUrl,
		};
		await this.sqs.sendMessage(parameters).promise();
	}
}
