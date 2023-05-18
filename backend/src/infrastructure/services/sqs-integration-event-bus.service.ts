/* eslint-disable @typescript-eslint/naming-convention */
import {type SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';
import {type IntegrationEventBus} from '@/application/interfaces/integration-event-bus.service.interface';
import {type IntegrationEvent} from '@/application/events/integration.event';

export class SqsIntegrationEventBus implements IntegrationEventBus {
	constructor(
		private readonly sqs: SQSClient,
		private readonly integrationEventQueueUrl: string,
	) {}

	async publishIntegrationEvent<T extends IntegrationEvent<string>>(event: T): Promise<void> {
		const cmd = new SendMessageCommand({
			MessageBody: JSON.stringify(event),
			QueueUrl: this.integrationEventQueueUrl,
		});
		await this.sqs.send(cmd);
	}
}
