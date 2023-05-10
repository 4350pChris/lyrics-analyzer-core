import test from 'ava';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type Queue} from '@/application/interfaces/queue.interface';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

const getLyricsApiService: () => LyricsApiService = () => ({
	async retrieveSongsForArtist() {
		throw new Error('not implemented');
	},
	async getArtist() {
		throw new Error('not implemented');
	},
	async parseLyrics() {
		throw new Error('not implemented');
	},
	searchArtists(query) {
		throw new Error('not implemented');
	},
});

const getArtistRepository: () => ArtistRepository = () => ({
	async list() {
		throw new Error('Not implemented');
	},
	async save() {
		throw new Error('Not implemented');
	},
	getById(artistId) {
		throw new Error('Not implemented');
	},
});

test('Should retrieve all songs from genius API then push to SQS queue in chunks of 10', async t => {
	const lyricsApiService = getLyricsApiService();
	lyricsApiService.retrieveSongsForArtist = async () => Array.from({length: 100}, (_, i) => ({id: i, title: 'title', url: 'url'}));
	lyricsApiService.getArtist = async () => ({id: 1, name: 'name', description: 'description', imageUrl: 'imageUrl'});

	const artistRepository = getArtistRepository();
	artistRepository.save = async artist => {
		t.pass();
		return artist;
	};

	const fetchSongs = new FetchSongs(lyricsApiService, artistRepository,
		{
			async publish(value: string) {
				const array = JSON.parse(value) as FetchSongsDto;
				t.is(array.songs.length, 10);
			},
		} as Queue);

	await fetchSongs.execute(1);
});
