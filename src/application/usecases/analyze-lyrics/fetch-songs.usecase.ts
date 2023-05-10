import {type UseCase} from '../usecase';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type SongDto} from '@/application/dtos/song.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type Queue} from '@/application/interfaces/queue.interface';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

export class FetchSongs implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly artistRepository: ArtistRepository,
		private readonly queue: Queue,
	) {}

	async execute(artistId: number): Promise<void> {
		const songs = await this.lyricsApiService.retrieveSongsForArtist(artistId);
		const apiArtist = await this.lyricsApiService.getArtist(artistId);
		const chunks = this.chunkSongs(songs);

		await Promise.all(chunks.map(async chunk => {
			const dto: FetchSongsDto = {artistId: artistId.toString(), songs: chunk};
			return this.queue.publish(JSON.stringify(dto));
		}));

		const artist = new ArtistAggregate(apiArtist.name, apiArtist.description, apiArtist.imageUrl);
		artist.id = artistId;
		await this.artistRepository.save(artist);
	}

	private chunkSongs(songs: SongDto[], chunkSize = 10): SongDto[][] {
		const chunks = [];

		for (let i = 0; i < songs.length; i += chunkSize) {
			const chunk = songs.slice(i, i + chunkSize);
			chunks.push(chunk);
		}

		return chunks;
	}
}
