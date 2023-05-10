import test from 'ava';
import td from 'testdouble';
import {type ModelType} from 'dynamoose/dist/General';
import {type ProcessModelItem} from '@/infrastructure/models/process.model';
import {DynamooseProcessRepository} from '@/infrastructure/repositories/dynamoose-process.repository';

const setupMocks = () => ({
	processModel: td.object<ModelType<ProcessModelItem>>(),
});

test('should save a process', async t => {
	const {processModel} = setupMocks();
	const dynamooseProcessRepository = new DynamooseProcessRepository(processModel);

	await dynamooseProcessRepository.save('process-id', 10);

	t.is(td.explain(processModel.create).callCount, 1);
	t.deepEqual(td.explain(processModel.create).calls[0].args[0], {id: 'process-id', total: 10});
});

test('should update a process', async t => {
	const {processModel} = setupMocks();
	const dynamooseProcessRepository = new DynamooseProcessRepository(processModel);

	await dynamooseProcessRepository.update('process-id', 5);

	t.is(td.explain(processModel.update).callCount, 1);
	t.deepEqual(td.explain(processModel.update).calls[0].args[0], {id: 'process-id'});
	t.deepEqual(td.explain(processModel.update).calls[0].args[1], {total: 5});
});

test('should get a process\'s total', async t => {
	const {processModel} = setupMocks();
	const dynamooseProcessRepository = new DynamooseProcessRepository(processModel);

	td.when(processModel.get('process-id')).thenResolve({id: 'process-id', total: 10});

	const total = await dynamooseProcessRepository.get('process-id');

	t.is(total, 10);
});
