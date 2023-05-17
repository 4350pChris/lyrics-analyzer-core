import {type UseCase} from '../../interfaces/usecase';
import {type SongDto} from '@/application/dtos/song.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

export class FetchSongs implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
	) {}

	async execute(artistId: number): Promise<SongDto[]> {
		return this.lyricsApiService.retrieveSongsForArtist(artistId);
	}
}
