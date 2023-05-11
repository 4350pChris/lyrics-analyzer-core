import test from 'ava';
import td from 'testdouble';
import {SQS} from 'aws-sdk';
import {SqsQueueService} from '@/infrastructure/services/sqs-queue.service';

const setupMocks = () => ({
	sqs: td.object(new SQS()),
	queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/queue-name',
});

test('publish', async t => {
	const {sqs, queueUrl} = setupMocks();
	const queueService = new SqsQueueService(sqs, queueUrl);
	const message = 'message';

	const innerPromise = td.func();
	td.when(innerPromise()).thenResolve({});

	td.when(sqs.sendMessage(td.matchers.anything() as SQS.SendMessageRequest)).thenReturn({
		promise: innerPromise as () => Promise<any>,
	});

	await queueService.publish(message);

	t.is(td.explain(innerPromise).callCount, 1);
});
