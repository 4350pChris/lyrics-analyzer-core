import {type ModelType} from 'dynamoose/dist/General';
import type {Mapper} from '../interfaces/mapper.interface';
import type {ArtistModelItem, ArtistModelType} from '../models/artist.model';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import type {ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import type {ArtistDetailDto} from '@/application/dtos/artist-detail.dto';

export class DynamooseArtistRepository implements ArtistRepository {
	constructor(
		private readonly artistMapper: Mapper<ArtistAggregate, ArtistModelType, ArtistDetailDto>,
		private readonly artistModel: ModelType<ArtistModelItem>,
	) {}

	async list(): Promise<ArtistDetailDto[]> {
		const result = await this.artistModel.scan().attributes([
			'id',
			'name',
			'description',
			'imageUrl',
			'stats',
		]).exec();
		return result.map(item => this.artistMapper.toDto(item));
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
