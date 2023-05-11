import test from 'ava';
import td from 'testdouble';
import {TriggerWorkflow} from '@/application/usecases/analyze-lyrics/trigger-workflow.usecase';
import {type Queue} from '@/application/interfaces/queue.interface';

const setupMocks = () => ({
	queueService: td.object<Queue>(),
});

test('Should trigger workflow by pushing artist id to SQS queue', async t => {
	const {queueService} = setupMocks();

	td.when(queueService.publish(td.matchers.isA(String) as string)).thenResolve();

	const usecase = new TriggerWorkflow(queueService);

	await usecase.execute('123');

	t.is(td.explain(queueService.publish).calls[0].args[0], JSON.stringify({artistId: '123'}));
});
