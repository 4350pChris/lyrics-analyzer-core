import type {GeniusSongDto} from './genius-song.dto';
import type {GeniusResponse} from './genius-response.dto';

export type SearchResponse = GeniusResponse<{
	hits: Array<{
		result: GeniusSongDto;
	}>;
}>;
