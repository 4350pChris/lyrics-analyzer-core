import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';

export class AnalyzeLyrics {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute(artistId: number): Promise<void> {
		let artist: ArtistAggregate;
		try {
			artist = await this.artistRepository.getById(artistId);
		} catch (error) {
			throw new Error('Artist not found', {cause: error});
		}

		for (const song of songs) {
			artist.addSong(song.id, song.title, song.text, song.url);
		}

		artist.calculateStats();

		await this.artistRepository.save(artist);
	}
}
