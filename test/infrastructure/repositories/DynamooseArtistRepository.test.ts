import test from 'ava';
import dynamoose from "dynamoose"
import { ArtistRepository } from '../../../src/infrastructure/repositories/DynamooseArtistRepository.js';
import { ArtistModel } from '../../../src/infrastructure/models/ArtistModel.js';
import { ArtistMapper } from '../../../src/infrastructure/mappers/ArtistMapper.js';
import type { AnyItem } from 'dynamoose/dist/Item.js';

const getDummyArtist = () => ({
  id: "1",
  name: "name",
  description: "description",
  songs: [
    {
      name: "song name",
      text: "song text"
    }
  ]
} satisfies Partial<AnyItem>);

const mapper = new ArtistMapper()
const repo = new ArtistRepository()

test.before(() => {
  dynamoose.aws.ddb.local();
});

test.afterEach.always(async () => {
  await ArtistModel.delete(getDummyArtist().id)
})

test.serial('Get by id', async (t) => {
  await ArtistModel.create(getDummyArtist());

  const artist = await repo.getById(1);
  t.deepEqual(artist, mapper.toDomain(getDummyArtist()));
});

test.serial('Save artist', async (t) => {
  const dummy = mapper.toDomain(getDummyArtist())
  const artist = await repo.save(dummy)
  t.deepEqual(artist, dummy);
});
