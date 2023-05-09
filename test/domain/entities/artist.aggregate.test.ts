import test from 'ava';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';

const makeArtist = (name: string, description: string) => new ArtistAggregate(name, description);

const makeSong = (name: string, text: string) => new Song(1, name, text, 'url');

const makeArtistWithSongs = (name: string, description: string, songs: Song[]) => {
	const artist = makeArtist(name, description);
	for (const song of songs) {
		artist.addSong(song.id, song.name, song.text, song.url);
	}

	return [artist, songs] as const;
};

test('Create artist', t => {
	const artist = makeArtist('name', 'description');
	t.is(artist.name, 'name');
	t.is(artist.description, 'description');
});

test('Add songs to artist', t => {
	const [artist, songs] = makeArtistWithSongs('name', 'description', [
		makeSong('song1', 'text1'),
		makeSong('song2', 'text2'),
	]);
	t.deepEqual(artist.songs, songs);
});

test('Get combined word list', t => {
	const [artist, songs] = makeArtistWithSongs('name', 'description', [
		makeSong('song1', 'text1'),
		makeSong('song2', 'text1 text2'),
	]);
	const wordList = artist.getCombinedWordList();
	t.deepEqual(wordList, {text1: 2, text2: 1});
});

test('Get stats for artist', t => {
	const [artist, songs] = makeArtistWithSongs('name', 'description', [
		makeSong('song1', 'text1'),
		makeSong('song2', 'text2'),
	]);
	artist.calculateStats();
	t.not(artist.stats, undefined);
	t.is(artist.stats!.uniqueWords, 2);
	t.is(artist.stats!.averageLength, 5);
});
