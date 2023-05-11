import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';
import {type UseCase} from '@/application/interfaces/usecase';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

export class AnalyzeLyrics implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute({artistId, songs}: ParsedSongsDto): Promise<void> {
		let artist: ArtistAggregate;
		try {
			artist = await this.artistRepository.getById(Number.parseInt(artistId));
		} catch (error) {
			throw new Error('Artist not found', {cause: error});
		}

		for (const song of songs) {
			artist.addSong(song.id, song.title, song.text);
		}

		artist.calculateStats();

		await this.artistRepository.save(artist);
	}
}
