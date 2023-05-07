import {type ArtistAggregate} from '../../domain/entities/artist.aggregate.js';
import type {ArtistRepository} from '../../domain/interfaces/artist.repository.js';
import {ArtistMapper} from '../mappers/artist.mapper.js';
import {artistModel} from '../models/artist.model.js';

export class DynamooseArtistRepository implements ArtistRepository {
	constructor(
		private readonly mapper = new ArtistMapper(),
	) {}

	async getById(id: number): Promise<ArtistAggregate> {
		const result = await artistModel.query('id').eq(id.toString()).exec();
		return this.mapper.toDomain(result[0]);
	}

	async save(artist: ArtistAggregate): Promise<ArtistAggregate> {
		const model = await artistModel.create(this.mapper.toModel(artist));
		return this.mapper.toDomain(model);
	}
}
