import {type SongDto} from './song.dto';

export type FetchSongsDto = {
	artistId: number;
	songs: SongDto[];
};
