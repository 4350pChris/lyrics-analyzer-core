import type {Mapper} from '../interfaces/mapper.interface';
import {type ArtistModelType} from '../models/artist.model';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';
import {type ArtistFactory} from '@/domain/interfaces/artist.factory.interface';
import {Stats} from '@/domain/entities/stats.value-object';
import {type ArtistDetailDto} from '@/application/dtos/artist-detail.dto';

export class ArtistMapper implements Mapper<ArtistAggregate, ArtistModelType, ArtistDetailDto> {
	constructor(
		private readonly artistFactory: ArtistFactory,
	) {}

	toDomain(model: ArtistModelType): ArtistAggregate {
		const songs = model.songs.map(s => new Song(s.id, s.name, s.text));
		let stats;
		if (model.stats) {
			const {averageLength, medianLength, uniqueWords} = model.stats;
			stats = new Stats(uniqueWords, averageLength, medianLength);
		}

		const artist = this.artistFactory.createArtist({
			id: model.id,
			name: model.name,
			description: model.description,
			imageUrl: model.imageUrl,
			songs,
			stats,
		});
		return artist;
	}

	toModel(artist: ArtistAggregate): ArtistModelType {
		const songs = artist.songs.map(s => ({id: s.id, name: s.name, text: s.text}));
		let stats;
		if (artist.stats) {
			const {averageLength, medianLength, uniqueWords} = artist.stats;
			stats = {averageLength, medianLength, uniqueWords};
		}

		return {
			id: artist.id,
			name: artist.name,
			description: artist.description,
			imageUrl: artist.imageUrl,
			songs,
			stats,
		};
	}

	toDto(item: ArtistAggregate): ArtistDetailDto {
		return {
			id: item.id,
			name: item.name,
			description: item.description,
			imageUrl: item.imageUrl,
		};
	}
}
