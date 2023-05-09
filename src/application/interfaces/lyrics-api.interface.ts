import {type ArtistDetailDto} from '../dtos/artist-detail.dto';
import {type SongDto} from '../dtos/song.dto';
import {type SearchArtistsDto} from '../dtos/search-artist.dto';

export type LyricsApiService = {
	searchArtists(query: string): Promise<SearchArtistsDto[]>;
	getArtist(artistId: number): Promise<ArtistDetailDto>;
	retrieveSongsForArtist(artistId: number): Promise<SongDto[]>;
	parseLyrics(url: URL): Promise<string>;
};
