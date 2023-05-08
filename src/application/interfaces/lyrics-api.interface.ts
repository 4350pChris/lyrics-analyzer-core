import {type RichSongDto} from '@/application/dtos/rich-song.dto';
import {type SearchArtistsDto} from '@/application/dtos/search-artist.dto';

export type LyricsApiService = {
	searchArtists: (query: string) => Promise<SearchArtistsDto[]>;
	retrievePaginatedSongs(artistId: number, page: number): Promise<RichSongDto[]>;
};
