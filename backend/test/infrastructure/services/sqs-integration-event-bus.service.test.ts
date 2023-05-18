import test from 'ava';
import td from 'testdouble';
import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';
import {SqsIntegrationEventBus} from '@/infrastructure/services/sqs-integration-event-bus.service';
import {type IntegrationEvent} from '@/application/events/integration.event';

const setupMocks = () => ({
	queueUrl: 'queue',
	sqs: td.instance(SQSClient),
});

test('Should publish to provided queue url without failing', async t => {
	const {sqs, queueUrl} = setupMocks();
	const eventBus = new SqsIntegrationEventBus(sqs, queueUrl);

	const event: IntegrationEvent<'test'> = {
		artistId: 1,
		eventType: 'test',
	};

	await eventBus.publishIntegrationEvent(event);

	t.pass();
});

test('Message body should contain stringified event', async t => {
	const {sqs, queueUrl} = setupMocks();
	const eventBus = new SqsIntegrationEventBus(sqs, queueUrl);

	const event = {
		artistId: 1,
		eventType: 'test',
		data: 'data',
	};

	td.when(sqs.send(td.matchers.isA(SendMessageCommand) as SendMessageCommand)).thenResolve({});

	await eventBus.publishIntegrationEvent(event);

	t.pass();
});

