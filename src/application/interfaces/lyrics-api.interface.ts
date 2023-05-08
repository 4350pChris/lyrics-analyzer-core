import {type SongDto} from '@/application/dtos/song.dto.js';
import {type SearchArtistsDto} from '@/application/dtos/search-artist.dto.js';

export type LyricsApiService = {
	searchArtists: (query: string) => Promise<SearchArtistsDto[]>;
	retrieveSongsForArtist(artistId: number): Promise<SongDto[]>;
};
