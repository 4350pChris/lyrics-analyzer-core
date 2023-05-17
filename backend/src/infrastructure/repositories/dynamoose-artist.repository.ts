import {type ModelType} from 'dynamoose/dist/General';
import type {Mapper} from '../interfaces/mapper.interface';
import type {ArtistModelItem, ArtistModelType} from '../models/artist.model';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import type {ArtistRepository} from '@/application/interfaces/artist-repository.interface';

export class DynamooseArtistRepository implements ArtistRepository {
	constructor(
		private readonly artistMapper: Mapper<ArtistAggregate, ArtistModelType, unknown>,
		private readonly artistModel: ModelType<ArtistModelItem>,
	) {}

	async list(): Promise<ArtistAggregate[]> {
		const result = await this.artistModel.scan().exec();
		return result.map(item => this.artistMapper.toDomain(item));
	}

	async create(artist: ArtistAggregate): Promise<ArtistAggregate> {
		const model = await this.artistModel.create(this.artistMapper.toModel(artist));
		return this.artistMapper.toDomain(model);
	}

	async update(artist: ArtistAggregate): Promise<ArtistAggregate> {
		const model = await this.artistModel.update(this.artistMapper.toModel(artist));
		return this.artistMapper.toDomain(model);
	}

	async getById(artistId: number): Promise<ArtistAggregate> {
		const result = await this.artistModel.get(artistId);
		return this.artistMapper.toDomain(result);
	}
}
