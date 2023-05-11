/* eslint-disable @typescript-eslint/naming-convention */
import test from 'ava';
import td from 'testdouble';
import type {SQS} from 'aws-sdk';
import {SqsQueueService} from '@/infrastructure/services/sqs-queue.service';

const setupMocks = () => ({
	sqs: td.object<SQS>(),
	queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/queue-name',
});

test('publish', async t => {
	const {sqs, queueUrl} = setupMocks();
	const queueService = new SqsQueueService(sqs, queueUrl);
	const message = 'message';
	const expectedParameters = {
		MessageBody: message,
		QueueUrl: queueUrl,
	};

	td.when(sqs.sendMessage(expectedParameters)).thenReturn(td.object());
	await queueService.publish(message);

	t.is(td.explain(sqs.sendMessage).callCount, 1);
	t.deepEqual(td.explain(sqs.sendMessage).calls[0].args[0], expectedParameters);
});
