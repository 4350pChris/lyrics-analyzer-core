import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

export class SearchArtists {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
	) {}

	async execute(query: string): Promise<SearchArtistsDto[]> {
		const artists = await this.lyricsApiService.searchArtists(query);
		return artists;
	}
}
