import test from 'ava';
import td from 'testdouble';
import {ConcreteArtistFactory} from '@/domain/factories/artist.factory';
import {type ArtistProps} from '@/domain/interfaces/artist-props.interface';
import {type StatisticsCalculator} from '@/domain/interfaces/statistics-calculator.interface';

test('Should return a valid artist', t => {
	const expected: ArtistProps = {
		id: 1,
		name: 'Test Artist',
		description: 'Test Description',
		imageUrl: 'https://test.com/image.jpg',
		songs: [],
	};
	const factory = new ConcreteArtistFactory(td.object());
	const artist = factory.createArtist(expected);
	t.like(artist, expected);
});

test('Should set statistics calculator', t => {
	const expected: ArtistProps = {
		id: 1,
		name: 'Test Artist',
		description: 'Test Description',
		imageUrl: 'https://test.com/image.jpg',
		songs: [],
	};
	const statsCalculator = td.object<StatisticsCalculator>();
	const factory = new ConcreteArtistFactory(statsCalculator);
	const artist = factory.createArtist(expected);
	t.is(artist.statisticsCalculator, statsCalculator);
});
