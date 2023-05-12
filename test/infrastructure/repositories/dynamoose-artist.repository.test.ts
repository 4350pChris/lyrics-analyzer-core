
import test from 'ava';
import td from 'testdouble';
import type {AnyItem} from 'dynamoose/dist/Item';
import {type ScanResponse} from 'dynamoose/dist/ItemRetriever';
import {DynamooseArtistRepository} from '@/infrastructure/repositories/dynamoose-artist.repository';
import {type getArtistModel} from '@/infrastructure/models/artist.model';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';

const setupMocks = () => ({
	artistModel: td.object<ReturnType<typeof getArtistModel>>(),
	mapper: td.instance(ArtistMapper),
});

test('List all', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.scan()).thenReturn({
		exec: async () => [1, 2, 3] as unknown as ScanResponse<AnyItem>,
	});

	td.when(mapper.toDomain(td.matchers.anything() as AnyItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.list();

	t.is(td.explain(artistModel.scan).callCount, 1);
	t.is(td.explain(mapper.toDomain).callCount, 3);
});

test('Save artist', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.create(td.matchers.anything() as Partial<AnyItem>)).thenResolve(td.object<AnyItem>());
	td.when(mapper.toModel(td.matchers.anything() as ArtistAggregate)).thenReturn(td.object<AnyItem>());
	td.when(mapper.toDomain(td.matchers.anything() as AnyItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.save(td.object());

	t.is(td.explain(artistModel.create).callCount, 1);
	t.is(td.explain(mapper.toModel).callCount, 1);
	t.is(td.explain(mapper.toDomain).callCount, 1);
});

test('Update artist', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.update(td.matchers.anything() as Partial<AnyItem>)).thenResolve(td.object<AnyItem>());
	td.when(mapper.toModel(td.matchers.anything() as ArtistAggregate)).thenReturn(td.object<AnyItem>());
	td.when(mapper.toDomain(td.matchers.anything() as AnyItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.update(td.object());

	t.is(td.explain(artistModel.create).callCount, 1);
	t.is(td.explain(mapper.toModel).callCount, 1);
	t.is(td.explain(mapper.toDomain).callCount, 1);
});

test('Get artist by id', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.get('1')).thenResolve(td.object<AnyItem>());
	td.when(mapper.toDomain(td.matchers.anything() as AnyItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.getById(1);

	t.is(td.explain(artistModel.get).callCount, 1);
	t.is(td.explain(artistModel.get).calls[0].args[0], '1');
	t.is(td.explain(mapper.toDomain).callCount, 1);
});
