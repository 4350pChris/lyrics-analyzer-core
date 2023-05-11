import test from 'ava';
import td from 'testdouble';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';
import {type StatisticsCalculator} from '@/domain/interfaces/statistics-calculator.interface';
import {type Stats} from '@/domain/entities/stats.value-object';

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
	const artist = makeArtist();
	for (const song of songs) {
		artist.addSong(song.id, song.name, song.text, song.url);
	}

	t.deepEqual(artist.songs, songs);
});

test('Get stats for artist calls on statistics calculator', t => {
	const artist = makeArtist();
	artist.statisticsCalculator = td.object<StatisticsCalculator>();

	const expectedStats: Stats = {
		averageLength: 1,
		uniqueWords: 2,
		medianLength: 3,
		wordList: {text: 1},
	};

	td.when(artist.statisticsCalculator.calculateStats(artist.songs)).thenReturn(expectedStats);
	artist.calculateStats();

	t.deepEqual(artist.stats, expectedStats);
});
