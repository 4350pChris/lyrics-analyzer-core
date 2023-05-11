import test from 'ava';
import td from 'testdouble';
import {type ModelType} from 'dynamoose/dist/General';
import {DynamooseProcessRepository} from '@/infrastructure/repositories/dynamoose-process.repository';
import {type ProcessModelItem} from '@/infrastructure/models/process.model';

const setupMocks = () => ({
	processModel: td.object<ModelType<ProcessModelItem>>(),
});

test('Should start process tracker', async t => {
	const artistId = '1';
	const songsCount = 10;

	const {processModel} = setupMocks();

	const processTracker = new DynamooseProcessRepository(processModel);

	td.when(processModel.create({id: artistId.toString(), total: songsCount})).thenResolve({});

	await processTracker.start(artistId, songsCount);

	t.deepEqual(td.explain(processModel.create).calls[0].args, [{id: artistId, total: songsCount}]);
});

test('Should decrement process tracker', async t => {
	const artistId = '1';
	const decrementValue = 1;

	const {processModel} = setupMocks();

	const processTracker = new DynamooseProcessRepository(processModel);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	td.when(processModel.update(td.matchers.anything())).thenResolve({});

	await processTracker.decrement(artistId, decrementValue);

	t.pass();
});

test('Should check if process is running', async t => {
	const artistId = 1;
	const songsCount = 10;

	const {processModel} = setupMocks();

	const processTracker = new DynamooseProcessRepository(processModel);

	td.when(processModel.get(artistId.toString())).thenResolve({total: songsCount});

	const isRunning = await processTracker.isRunning(artistId);

	t.true(isRunning);
});

test('Should declare process as not running when it is not found', async t => {
	const artistId = 1;

	const {processModel} = setupMocks();

	const processTracker = new DynamooseProcessRepository(processModel);

	td.when(processModel.get(artistId.toString())).thenResolve({});

	const isRunning = await processTracker.isRunning(artistId);

	t.false(isRunning);
});

