import {type ModelType} from 'dynamoose/dist/General';
import type {Mapper} from '../interfaces/mapper.interface';
import type {ArtistModelItem} from '../models/artist.model';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import type {ArtistRepository} from '@/application/interfaces/artist-repository.interface';

export class DynamooseArtistRepository implements ArtistRepository {
	constructor(
		private readonly artistMapper: Mapper<ArtistAggregate, ArtistModelItem>,
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

	async addSongs(artist: ArtistAggregate): Promise<void> {
		const model = this.artistMapper.toModel(artist);
		await this.artistModel.update(model);
	}

	async getById(artistId: number): Promise<ArtistAggregate> {
		const result = await this.artistModel.get(artistId.toString());
		return this.artistMapper.toDomain(result);
	}
}
