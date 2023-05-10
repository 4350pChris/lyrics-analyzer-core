import test from 'ava';
import td from 'testdouble';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {type Queue} from '@/application/interfaces/queue.interface';

const setupMocks = () => ({
	queue: td.object<Queue>(),
});

test('Should trigger workflow by pushing artist id to SQS queue', async t => {
	const {queue} = setupMocks();

	td.when(queue.publish(td.matchers.isA(String) as string)).thenResolve();

	const usecase = new AnalyzeLyrics(queue);

	await usecase.execute('123');

	t.is(td.explain(queue.publish).calls[0].args[0], JSON.stringify({artistId: '123'}));
});
