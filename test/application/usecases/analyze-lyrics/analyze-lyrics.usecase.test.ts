import test from 'ava';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type SongDto} from '@/application/dtos/song.dto';
import {SongChunk} from '@/domain/entities/song-chunk.entity';

test('Should chunk songs and send chunks to SQS queue', async t => {
	const artist = new ArtistAggregate('MF DOOM', 'ALL CAPS');
	const lyricsApiService: LyricsApiService = {
		getArtist(artistId) {
			throw new Error('Not implemented');
		},
		searchArtists() {
			throw new Error('Not implemented');
		},
		parseLyrics(url) {
			throw new Error('Not implemented');
		},
		async retrieveSongsForArtist(artistId) {
			return [
				{
					id: artistId,
					title: 'Accordion',
					url: 'url',
				},
			] satisfies SongDto[];
		},
	};
	const usecase = new AnalyzeLyrics(lyricsApiService, {
		async publish(message) {
			const chunk = SongChunk.unserialize(message);
			for (const song of chunk.songs) {
				artist.addSong(song.id, song.name, '', song.url);
			}
		},
	});

	await usecase.execute(123);

	t.is(artist.songs.length, 1);
});
