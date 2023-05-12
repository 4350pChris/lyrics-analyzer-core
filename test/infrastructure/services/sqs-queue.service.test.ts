import test, {type ExecutionContext} from 'ava';
import td from 'testdouble';
import {SQSClient, type SendMessageCommand} from '@aws-sdk/client-sqs';
import {SqsQueueService} from '@/infrastructure/services/sqs-queue.service';

const macro = async <T extends keyof SqsQueueService> (t: ExecutionContext, method: T, dto: Parameters<SqsQueueService[T]>['0']) => {
	const sqs = td.instance(SQSClient);
	const queueService = new SqsQueueService(sqs, 'fetchqueue', 'parsequeue', 'analysisqueue');

	td.when(sqs.send(td.matchers.anything() as SendMessageCommand)).thenResolve({});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	await queueService[method](dto as any);

	t.is(td.explain(sqs.send).calls.length, 1);
};

macro.title = (title: string | undefined, method: string) => `${title ?? 'sqs-queue-service'} ${method}`;

test('publish to fetch queue', macro, 'sendToFetchQueue', {artistId: '1'});
test('publish to parse queue', macro, 'sendToParseQueue', {artistId: '1', songs: []});
