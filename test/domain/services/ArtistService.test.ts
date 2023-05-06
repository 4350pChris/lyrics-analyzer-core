import test from 'ava';
import { ArtistService } from '../../../src/domain/services/ArtistService.js';
import { Artist } from '../../../src/domain/entities/Artist.js';
import { Song } from '../../../src/domain/entities/Song.js';
import type { IArtistRepository } from '../../../src/domain/interfaces/IArtistRepository.js';

const artistRepository: IArtistRepository = {
    getArtistById: async (artistId: number) => {
        return new Artist("name", "description", "imageUrl", [
          new Song("song1", "text1"),
          new Song("song2", "text2"),
          new Song("song3", "text3"),
        ]);
    }
}

test('ArtistService should return the correct stats', async (t) => {
    const artistService = new ArtistService(artistRepository);
    const stats = await artistService.getStatsForArtist(1);
    t.is(stats.uniqueWords, 3);
    t.is(stats.averageLength, 5);
    t.is(stats.medianLength, 5);
});
