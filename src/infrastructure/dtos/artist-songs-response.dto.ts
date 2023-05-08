import type {GeniusResponse} from './genius-response.dto.js';
import type {GeniusSong} from './genius-song.dto.js';

export type ArtistSongsResponse = GeniusResponse<{
	songs: GeniusSong[];
}>;
