import test from 'ava';
import td from 'testdouble';
import {SNSClient, PublishCommand} from '@aws-sdk/client-sns';
import {SnsIntegrationEventBus} from '@/infrastructure/services/sns-integration-event-bus.service';
import {type IntegrationEvent} from '@/application/events/integration.event';

const setupMocks = () => ({
	topicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic',
	sns: td.instance(SNSClient),
});

test('Should publish to provided queue url without failing', async t => {
	const {sns, topicArn} = setupMocks();
	const eventBus = new SnsIntegrationEventBus(sns, topicArn);

	const event: IntegrationEvent<'test'> = {
		artistId: 1,
		eventType: 'test',
	};

	await eventBus.publishIntegrationEvent(event);

	t.pass();
});

test('Message body should contain stringified event', async t => {
	const {sns, topicArn} = setupMocks();
	const eventBus = new SnsIntegrationEventBus(sns, topicArn);

	const event = {
		artistId: 1,
		eventType: 'test',
		data: 'data',
	};

	td.when(sns.send(td.matchers.isA(PublishCommand) as PublishCommand)).thenResolve({});

	await eventBus.publishIntegrationEvent(event);

	t.pass();
});

