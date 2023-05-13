import type {AggregateRoot} from '../interfaces/aggregate-root.interface';
import {type ArtistProps} from '../interfaces/artist-props.interface';
import {type StatisticsCalculator} from '../interfaces/statistics-calculator.interface';
import {Song} from './song.entity';
import {type Stats} from './stats.value-object';

export class ArtistAggregate implements AggregateRoot {
	readonly id!: number;
	readonly name!: string;
	readonly description!: string;
	readonly imageUrl?: string;
	readonly songs!: Song[];
	private statisticsCalculator?: StatisticsCalculator;

	private _stats: Stats | undefined;
	get stats(): Stats | undefined {
		return this._stats;
	}

	private set stats(v: Stats | undefined) {
		this._stats = v;
	}

	constructor(props: ArtistProps) {
		Object.assign(this, props);
	}

	setStatisticsCalculator(calculator: StatisticsCalculator): void {
		this.statisticsCalculator = calculator;
	}

	addSong(id: number, name: string, text: string): void {
		const song = new Song(id, name, text);
		this.songs.push(song);
	}

	calculateStats(): void {
		if (!this.statisticsCalculator) {
			throw new Error('No statistics calculator set');
		}

		this.stats = this.statisticsCalculator.calculateStats(this.songs);
	}
}
