import type { AnyItem } from 'dynamoose/dist/Item.js';
import type { IMapper } from '../interfaces/IMapper.js';
import { ArtistAggregate } from '../../domain/entities/ArtistAggregate.js';
import { Song } from '../../domain/entities/Song.js';

export class ArtistMapper implements IMapper<ArtistAggregate> {
  toDomain(model: Partial<AnyItem>): ArtistAggregate {
    const songs = model.songs.map((s: any) => new Song(s.name, s.text));
    const artist = new ArtistAggregate(model.name, model.description, model.imageUrl, songs);
    artist.id = parseInt(model.id);
    return artist;
  }

  toModel(artist: ArtistAggregate): Partial<AnyItem> {
    const songs = artist.songs.map((s) => ({ name: s.name, text: s.text }));
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
