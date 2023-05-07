import type {UseCase} from '../usecase';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto';
import type {GeniusApiService} from '@/application/interfaces/genius-api.service';

export class SearchArtists implements UseCase {
	constructor(
		private readonly geniusService: GeniusApiService,
	) {}

	async execute(query: string): Promise<SearchArtistsDto[]> {
		const songs = await this.geniusService.search(query);
		const artists = songs.map(song => song.primary_artist);
		return artists;
	}
}
