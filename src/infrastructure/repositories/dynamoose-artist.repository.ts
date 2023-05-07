import type {Mapper} from '../interfaces/mapper';
import type {getArtistModel as ArtistModelFnType} from '../models/artist.model.js';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate.js';
import type {ArtistRepository} from '@/domain/interfaces/artist.repository.js';

export class DynamooseArtistRepository implements ArtistRepository {
	constructor(
		private readonly artistMapper: Mapper<ArtistAggregate>,
		private readonly artistModel: ReturnType<typeof ArtistModelFnType>,
	) {}

	async getById(id: number): Promise<ArtistAggregate> {
		const result = await this.artistModel.query('id').eq(id.toString()).exec();
		return this.artistMapper.toDomain(result[0]);
	}

	async save(artist: ArtistAggregate): Promise<ArtistAggregate> {
		const model = await this.artistModel.create(this.artistMapper.toModel(artist));
		return this.artistMapper.toDomain(model);
	}
}