import { ArtistAggregate } from '../../domain/entities/ArtistAggregate.js';
import type { IArtistRepository } from "../../domain/interfaces/IArtistRepository.js"
import { ArtistMapper } from '../mappers/ArtistMapper.js';
import { ArtistModel } from '../models/ArtistModel.js';

export class ArtistRepository implements IArtistRepository {
  constructor(
    private readonly mapper = new ArtistMapper()
  ) {}

  async getById(id: number): Promise<ArtistAggregate> {
    const result = await ArtistModel.query('id').eq(id.toString()).exec();
    return this.mapper.toDomain(result[0]);
  }

  async save(artist: ArtistAggregate): Promise<ArtistAggregate> {
    const model = await ArtistModel.create(this.mapper.toModel(artist));
    return this.mapper.toDomain(model);
  }
}
