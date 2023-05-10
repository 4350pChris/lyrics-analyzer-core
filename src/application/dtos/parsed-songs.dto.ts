import {type SongDto} from './song.dto';

export type ParsedSongsDto = {
	artistId: string;
	songs: Array<SongDto & {text: string}>;
};
