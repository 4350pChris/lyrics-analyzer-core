import type {GeniusResponse} from './genius-response.dto.js';
import type {GeniusSongDto} from './genius-song.dto.js';

export type ArtistSongsResponse = GeniusResponse<{
	songs: GeniusSongDto[];
	next_page: number | undefined;
}>;
