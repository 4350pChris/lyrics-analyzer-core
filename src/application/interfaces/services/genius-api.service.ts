import type {GeniusSong} from '../responses/genius-song.response';

export type GeniusApiService = {
	search: (query: string) => Promise<GeniusSong[]>;
	retrievePaginatedSongs(artist: string, page: number): Promise<GeniusSong[]>;
};
