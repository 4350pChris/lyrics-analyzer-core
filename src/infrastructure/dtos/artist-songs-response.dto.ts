import type {GeniusResponse} from './genius-response.dto';
import type {GeniusSongDto} from './genius-song.dto';

export type ArtistSongsResponse = GeniusResponse<{
	songs: GeniusSongDto[];
	next_page: number | undefined;
}>;
