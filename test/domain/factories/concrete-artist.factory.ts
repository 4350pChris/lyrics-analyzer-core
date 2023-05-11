import test from 'ava';
import {createArtist} from '@/domain/factories/artist.factory';
import {type ArtistProps} from '@/domain/interfaces/artist-props.interface';

test('Should return a valid artist', t => {
	const expected: ArtistProps = {
		id: 1,
		name: 'Test Artist',
		description: 'Test Description',
		imageUrl: 'https://test.com/image.jpg',
		songs: [],
	};
	const artist = createArtist(expected);
	t.like(artist, expected);
});
