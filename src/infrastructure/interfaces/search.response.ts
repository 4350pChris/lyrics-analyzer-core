import type {GeniusSong} from './genius-song.js';
import type {GeniusResponse} from './genius.response.js';

export type SearchResponse = GeniusResponse<{
	hits: Array<{
		result: GeniusSong;
	}>;
}>;
