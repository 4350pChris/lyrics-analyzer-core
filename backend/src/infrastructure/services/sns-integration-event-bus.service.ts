/* eslint-disable @typescript-eslint/naming-convention */
import {type SNSClient, PublishCommand} from '@aws-sdk/client-sns';
import {type IntegrationEventBus} from '@/application/interfaces/integration-event-bus.service.interface';
import {type IntegrationEvent} from '@/application/events/integration.event';

export class SnsIntegrationEventBus implements IntegrationEventBus {
	constructor(
		private readonly sns: SNSClient,
		private readonly integrationEventTopicArn: string,
	) {}

	async publishIntegrationEvent<T extends IntegrationEvent<string>>(event: T): Promise<void> {
		const {eventType, ...message} = event;
		const cmd = new PublishCommand({
			MessageAttributes: {
				eventType: {
					DataType: 'String',
					StringValue: eventType,
				},
			},
			Message: JSON.stringify(message),
			TopicArn: this.integrationEventTopicArn,
		});
		await this.sns.send(cmd);
	}
}
