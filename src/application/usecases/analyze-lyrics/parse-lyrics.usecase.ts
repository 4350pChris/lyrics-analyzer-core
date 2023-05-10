import {type UseCase} from '../usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';
import {type Queue} from '@/application/interfaces/queue.interface';

export class ParseLyrics implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly queue: Queue,
	) {}

	async execute({artistId, songs}: FetchSongsDto) {
		const parsedSongs = await Promise.allSettled(songs.map(async song => ({
			...song,
			text: await this.lyricsApiService.parseLyrics(new URL(song.url)),
		})));

		const successfulSongs = [];
		for (const result of parsedSongs) {
			if (result.status === 'fulfilled') {
				successfulSongs.push(result.value);
			}
		}

		const dto: ParsedSongsDto = {artistId, songs: successfulSongs};
		await this.queue.publish(JSON.stringify(dto));
	}
}
