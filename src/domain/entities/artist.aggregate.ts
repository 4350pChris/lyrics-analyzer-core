import type {AggregateRoot} from '../interfaces/aggregate-root.js';
import {BaseEntity} from './base.entity.js';
import {Song} from './song.value-object.js';
import {Stats} from './stats.value-object.js';

export class ArtistAggregate extends BaseEntity implements AggregateRoot {
	constructor(
		public name: string,
		public description: string,
		public imageUrl?: string,
		public songs: Song[] = [],
		public stats?: Stats,
	) {
		super();
	}

	// TODO: clarify - should this also update stats?
	public addSong(name: string, text: string): void {
		const song = new Song(name, text);
		this.songs.push(song);
	}

	public getCombinedWordList(): Record<string, number> {
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

	public calculateStats(): void {
		const wordList = this.getCombinedWordList();
		const stats = new Stats(wordList);
		stats.calculateUniqueWords();
		stats.calculateAverageLengthOfWords();
		stats.calculateMedianLengthOfWords();
		this.stats = stats;
	}
}
