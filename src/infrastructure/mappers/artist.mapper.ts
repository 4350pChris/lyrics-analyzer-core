/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {AnyItem} from 'dynamoose/dist/Item.js';
import type {Mapper} from '../interfaces/mapper.js';
import {ArtistAggregate} from '../../domain/entities/artist.aggregate.js';
import {Song} from '../../domain/entities/song.value-object.js';

export class ArtistMapper implements Mapper<ArtistAggregate> {
	toDomain(model: Partial<AnyItem>): ArtistAggregate {
		const songs = model.songs.map((s: any) => new Song(s.name, s.text));
		const artist = new ArtistAggregate(model.name, model.description, model.imageUrl, songs);
		artist.id = Number.parseInt(model.id);
		return artist;
	}

	toModel(artist: ArtistAggregate): Partial<AnyItem> {
		const songs = artist.songs.map(s => ({name: s.name, text: s.text}));
		return {
			id: artist.id?.toString(),
			name: artist.name,
			description: artist.description,
			imageUrl: artist.imageUrl,
			songs,
			stats: artist.stats,
		};
	}
}
