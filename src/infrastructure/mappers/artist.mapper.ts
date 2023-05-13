import type {Mapper} from '../interfaces/mapper.interface';
import {type ArtistModelType} from '../models/artist.model';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';
import {type ArtistFactory} from '@/domain/interfaces/concrete-artist.factory.interface';
import {Stats} from '@/domain/entities/stats.value-object';

export class ArtistMapper implements Mapper<ArtistAggregate, ArtistModelType> {
	constructor(
		private readonly artistFactory: ArtistFactory,
	) {}

	toDomain(model: ArtistModelType): ArtistAggregate {
		const songs = model.songs.map(s => new Song(s.id, s.name, s.text));
		let stats;
		if (model.stats) {
			const {averageLength, medianLength, uniqueWords, wordList} = model.stats;
			stats = new Stats(uniqueWords, averageLength, medianLength, wordList);
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
			const {averageLength, medianLength, uniqueWords, wordList} = artist.stats;
			stats = {averageLength, medianLength, uniqueWords, wordList};
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
}
