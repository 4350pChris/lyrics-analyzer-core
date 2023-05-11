import test from 'ava';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';

const makeSong = (name: string, text: string) => new Song(1, name, text, 'url');

const makeArtist = (songs: Song[] = []) =>
	new ArtistAggregate({
		id: 1,
		name: 'name',
		description: 'description',
		songs,
	});

test('Create artist', t => {
	const artist = makeArtist();
	t.is(artist.name, 'name');
	t.is(artist.description, 'description');
});

test('Add songs to artist', t => {
	const songs = [makeSong('song1', 'text1'), makeSong('song2', 'text2')];
	const artist = makeArtist(songs);
	t.deepEqual(artist.songs, songs);
});

test('Get combined word list', t => {
	const artist = makeArtist([
		makeSong('song1', 'text1'),
		makeSong('song2', 'text1 text2'),
	]);
	const wordList = artist.getCombinedWordList();
	t.deepEqual(wordList, {text1: 2, text2: 1});
});

test('Get stats for artist', t => {
	const artist = makeArtist([
		makeSong('song1', 'text1'),
		makeSong('song2', 'text2'),
	]);
	artist.calculateStats();
	t.not(artist.stats, undefined);
	t.is(artist.stats.uniqueWords, 2);
	t.is(artist.stats.averageLength, 5);
});
