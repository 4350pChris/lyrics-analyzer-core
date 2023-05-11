import test from 'ava';
import td from 'testdouble';
import {ConcreteStatisticsCalculator} from '@/domain/services/concrete-statistics-calculator.service';
import {type Song} from '@/domain/entities/song.entity';

const makeSong = (text: string) => {
	const song = td.object<Song>({
		id: 1,
		name: 'song',
		text,
	});

	return song;
};

test('Calculate unique words', t => {
	const songs: Song[] = [
		makeSong('text1'),
		makeSong('text2'),
	];

	const stats = new ConcreteStatisticsCalculator().calculateStats(songs);

	t.is(stats.uniqueWords, 2);
});

test('Get average length of words', t => {
	const songs = [
		makeSong('a aa aaa'),
	];
	const stats = new ConcreteStatisticsCalculator().calculateStats(songs);
	t.is(stats.averageLength, 2);
});

test('Get average length of words, make sure weights are taken into account', t => {
	const songs = [
		makeSong('a aa aa aaa aaa aaa'),
	];
	const stats = new ConcreteStatisticsCalculator().calculateStats(songs);
	// (1 * 1 + 2 * 2 + 3 * 3) / (1 + 2 + 3) = 14 / 6
	t.is(stats.averageLength, 14 / 6);
});

test('Get median length of words for uneven wordlist', t => {
	const songs = [
		makeSong('a aa aaa'),
	];
	const stats = new ConcreteStatisticsCalculator().calculateStats(songs);
	t.is(stats.medianLength, 2);
});

test('Get median length of words for even wordlist', t => {
	const songs = [
		makeSong('a aa aaa aaaa'),
	];

	const stats = new ConcreteStatisticsCalculator().calculateStats(songs);

	t.is(stats.medianLength, 2.5);
});
