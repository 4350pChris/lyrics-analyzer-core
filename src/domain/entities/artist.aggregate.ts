import type {AggregateRoot} from '../interfaces/aggregate-root.interface';
import {BaseEntity} from './base.entity';
import {Song} from './song.entity';
import {Stats} from './stats.value-object';

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

	public addSong(id: number, name: string, text: string, url: string): void {
		const song = new Song(id, name, text, url);
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
