import type {AggregateRoot} from '../interfaces/aggregate-root.interface';
import {type ArtistProps} from '../interfaces/artist-props.interface';
import {Song} from './song.entity';
import {Stats} from './stats.value-object';

export class ArtistAggregate implements AggregateRoot {
	readonly id!: number;
	readonly name!: string;
	readonly description!: string;
	readonly imageUrl?: string;
	readonly songs!: Song[];

	private _stats !: Stats;
	get stats(): Stats {
		return this._stats;
	}

	private set stats(v: Stats) {
		this._stats = v;
	}

	constructor(props: ArtistProps) {
		Object.assign(this, props);
	}

	addSong(id: number, name: string, text: string, url: string): void {
		const song = new Song(id, name, text, url);
		this.songs.push(song);
	}

	getCombinedWordList(): Record<string, number> {
		const wordList: Record<string, number> = {};
		for (const song of this.songs) {
			const split = song.text.split(/\s+/);
			for (const word of split) {
				const currentCount = wordList[word] || 0;
				wordList[word] = currentCount + 1;
			}
		}

		return wordList;
	}

	calculateStats(): void {
		const wordList = this.getCombinedWordList();
		const stats = new Stats(wordList);
		stats.calculateUniqueWords();
		stats.calculateAverageLengthOfWords();
		stats.calculateMedianLengthOfWords();
		this.stats = stats;
	}
}
