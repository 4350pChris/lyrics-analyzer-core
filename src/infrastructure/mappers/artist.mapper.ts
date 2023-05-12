/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {AnyItem} from 'dynamoose/dist/Item';
import type {Mapper} from '../interfaces/mapper.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';
import {type ArtistFactory} from '@/domain/interfaces/concrete-artist.factory.interface';

export class ArtistMapper implements Mapper<ArtistAggregate> {
	constructor(
		private readonly artistFactory: ArtistFactory,
	) {}

	toDomain(model: Partial<AnyItem>): ArtistAggregate {
		const songs = model.songs.map((s: any) => new Song(s.id, s.name, s.text));
		const artist = this.artistFactory.createArtist({
			id: model.id,
			name: model.name,
			description: model.description,
			imageUrl: model.imageUrl,
			songs,
			stats: model.stats,
		});
		return artist;
	}

	toModel(artist: ArtistAggregate): Partial<AnyItem> {
		const songs = artist.songs.map(s => ({id: s.id, name: s.name, text: s.text}));
		return {
			id: artist.id,
			name: artist.name,
			description: artist.description,
			imageUrl: artist.imageUrl,
			songs,
			stats: artist.stats,
		};
	}
}
