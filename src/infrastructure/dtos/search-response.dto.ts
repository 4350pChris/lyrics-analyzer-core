import type {GeniusSong} from './genius-song.dto.js';
import type {GeniusResponse} from './genius-response.dto.js';

export type SearchResponse = GeniusResponse<{
	hits: Array<{
		result: GeniusSong;
	}>;
}>;
