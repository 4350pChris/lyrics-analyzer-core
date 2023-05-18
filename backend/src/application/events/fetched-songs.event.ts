import {type SongDto} from '../dtos/song.dto';
import {type IntegrationEvent} from './integration.event';

export type FetchedSongsEvent = IntegrationEvent<'fetchedSongs'> & {
	songs: SongDto[];
};
