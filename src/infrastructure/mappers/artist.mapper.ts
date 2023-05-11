import type {Mapper} from '../interfaces/mapper.interface';
import {type ArtistModelItem} from '../models/artist.model';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';

export class ArtistMapper implements Mapper<ArtistAggregate> {
	toDomain(model: ArtistModelItem): ArtistAggregate {
		const artist = new ArtistAggregate({
			id: Number.parseInt(model.id),
			name: model.name,
			description: model.description,
			imageUrl: model.imageUrl,
			songs: model.songs,
			stats: model.stats,
		});
		return artist;
	}

	toModel(artist: ArtistAggregate): Partial<ArtistModelItem> {
		return {
			id: artist.id?.toString(),
			name: artist.name,
			description: artist.description,
			imageUrl: artist.imageUrl,
			songs: artist.songs,
			stats: artist.stats,
		};
	}
}
