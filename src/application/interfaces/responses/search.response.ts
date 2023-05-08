import type {GeniusSong} from './genius-song.response.js';
import type {GeniusResponse} from './genius.response.js';

export type SearchResponse = GeniusResponse<{
	hits: Array<{
		result: GeniusSong;
	}>;
}>;
