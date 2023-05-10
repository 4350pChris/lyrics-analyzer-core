import test from 'ava';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

test('Should parse lyrics and push the result to a queue', async t => {
	const parseLyrics = new ParseLyrics({
		async parseLyrics() {
			return 'lyrics';
		},
	} as unknown as LyricsApiService, {
		async publish(value: string) {
			const {artistId, songs} = JSON.parse(value) as ParsedSongsDto;
			t.is(songs[0].text, 'lyrics');
			t.is(artistId, '1');
		},
	});

	await parseLyrics.execute({
		artistId: '1',
		songs: [{
			id: 1,
			title: 'title',
			url: 'https://genius.com/1',
		}],
	});

	t.pass();
});
