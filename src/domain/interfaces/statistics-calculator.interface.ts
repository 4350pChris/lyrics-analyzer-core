import {type Song} from '../entities/song.entity';
import {type Stats} from '../entities/stats.value-object';

export type StatisticsCalculator = {
	calculateStats(songs: Song[]): Stats;
};
