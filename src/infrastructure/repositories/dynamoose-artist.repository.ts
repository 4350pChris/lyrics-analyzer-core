import type {Mapper} from '../interfaces/mapper.interface';
import type {getArtistModel as ArtistModelFnType} from '../models/artist.model.js';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate.js';
import type {ArtistRepository} from '@/domain/interfaces/artist-repository.interface.js';

export class DynamooseArtistRepository implements ArtistRepository {
	constructor(
		private readonly artistMapper: Mapper<ArtistAggregate>,
		private readonly artistModel: ReturnType<typeof ArtistModelFnType>,
	) {}

	async list(): Promise<ArtistAggregate[]> {
		const result = await this.artistModel.scan().exec();
		return result.map(item => this.artistMapper.toDomain(item));
	}

	async save(artist: ArtistAggregate): Promise<ArtistAggregate> {
		const model = await this.artistModel.create(this.artistMapper.toModel(artist));
		return this.artistMapper.toDomain(model);
	}
}
