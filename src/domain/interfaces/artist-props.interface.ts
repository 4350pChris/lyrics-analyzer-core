import {type Song} from '../entities/song.entity';
import {type Stats} from '../entities/stats.value-object';

export type ArtistProps = {
	id: number;
	name: string;
	description: string;
	imageUrl?: string;
	songs: Song[];
	stats?: Stats;
};
