import {type SongDto} from './song.dto';

export type FetchSongsDto = {
	artistId: string;
	songs: SongDto[];
};
