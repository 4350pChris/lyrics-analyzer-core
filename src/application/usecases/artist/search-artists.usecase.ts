import type {UseCase} from '../usecase.js';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto.js';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface.js';

export class SearchArtists implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
	) {}

	async execute(query: string): Promise<SearchArtistsDto[]> {
		const artists = await this.lyricsApiService.searchArtists(query);
		return artists;
	}
}
