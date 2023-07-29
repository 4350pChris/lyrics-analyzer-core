
import test from 'ava';
import td from 'testdouble';
import {type ScanResponse} from 'dynamoose/dist/ItemRetriever';
import {type ModelType} from 'dynamoose/dist/General';
import {DynamooseArtistRepository} from '@/infrastructure/repositories/dynamoose-artist.repository';
import {type ArtistModelItem} from '@/infrastructure/models/artist.model';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type ArtistDetailDto} from '@/application/dtos/artist-detail.dto';

const setupMocks = () => ({
	artistModel: td.object<ModelType<ArtistModelItem>>(),
	mapper: td.instance(ArtistMapper),
});

test('List all', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.scan()).thenReturn({
		exec: async () => [1, 2, 3] as unknown as ScanResponse<ArtistModelItem>,
	});

	td.when(mapper.toDto(td.matchers.anything() as ArtistModelItem)).thenReturn(td.object<ArtistDetailDto>());

	await repo.list();

	t.is(td.explain(artistModel.scan).callCount, 1);
	t.is(td.explain(mapper.toDto).callCount, 3);
});

test('Save artist', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.create(td.matchers.anything() as Partial<ArtistModelItem>)).thenResolve(td.object<ArtistModelItem>());
	td.when(mapper.toModel(td.matchers.anything() as ArtistAggregate)).thenReturn(td.object<ArtistModelItem>());
	td.when(mapper.toDomain(td.matchers.anything() as ArtistModelItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.create(td.object());

	t.is(td.explain(artistModel.create).callCount, 1);
	t.is(td.explain(mapper.toModel).callCount, 1);
	t.is(td.explain(mapper.toDomain).callCount, 1);
});

test('Update artist', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.update(td.matchers.anything() as Partial<ArtistModelItem>)).thenResolve(td.object<ArtistModelItem>());
	td.when(mapper.toModel(td.matchers.anything() as ArtistAggregate)).thenReturn(td.object<ArtistModelItem>());
	td.when(mapper.toDomain(td.matchers.anything() as ArtistModelItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.update(td.object());

	t.is(td.explain(artistModel.update).callCount, 1);
	t.is(td.explain(mapper.toModel).callCount, 1);
	t.is(td.explain(mapper.toDomain).callCount, 1);
});

test('Get artist by id', async t => {
	const {artistModel, mapper} = setupMocks();
	const repo = new DynamooseArtistRepository(mapper, artistModel);

	td.when(artistModel.get(1)).thenResolve(td.object<ArtistModelItem>());
	td.when(mapper.toDomain(td.matchers.anything() as ArtistModelItem)).thenReturn(td.object<ArtistAggregate>());

	await repo.getById(1);

	t.is(td.explain(artistModel.get).callCount, 1);
	t.is(td.explain(artistModel.get).calls[0].args[0], 1);
	t.is(td.explain(mapper.toDomain).callCount, 1);
});
