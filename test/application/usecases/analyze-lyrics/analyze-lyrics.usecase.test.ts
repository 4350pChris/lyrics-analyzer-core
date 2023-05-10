import test from 'ava';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {type AnalyzeLyricsDto} from '@/application/dtos/analyze-lyrics.dto';

test('Should trigger workflow by pushing artist id to SQS queue', async t => {
	const usecase = new AnalyzeLyrics({
		async publish(message) {
			const dto: AnalyzeLyricsDto = {artistId: '123'};
			t.is(message, JSON.stringify(dto));
		},
	});

	await usecase.execute('123');
});
