import {type Song} from '../entities/song.entity';
import {Stats} from '../entities/stats.value-object';
import {type StatisticsCalculator} from '../interfaces/statistics-calculator.interface';

export class ConcreteStatisticsCalculator implements StatisticsCalculator {
	calculateStats(songs: Song[]): Stats {
		const wordList = this.getCombinedWordList(songs);
		return new Stats(
			this.calculateUniqueWords(wordList),
			this.calculateAverageLengthOfWords(wordList),
			this.calculateMedianLengthOfWords(wordList),
		);
	}

	getCombinedWordList(songs: Song[]): Record<string, number> {
		const wordList: Record<string, number> = {};
		for (const song of songs) {
			const split = song.text.split(/\s+/);
			for (const word of split) {
				const currentCount = wordList[word] || 0;
				wordList[word] = currentCount + 1;
			}
		}

		return Object.fromEntries(this.sortedWordList(wordList));
	}

	calculateUniqueWords(wordList: Record<string, number>): number {
		return Object.keys(wordList).length;
	}

	calculateAverageLengthOfWords(wordList: Record<string, number>): number {
		const totalLength = Object.entries(wordList)
			.reduce((acc, [word, count]) => acc + (word.length * count), 0);
		const totalWords = Object.values(wordList).reduce((acc, count) => acc + count, 0);
		return totalLength / totalWords;
	}

	calculateMedianLengthOfWords(wordList: Record<string, number>): number {
		const sorted = this.sortedWordList(wordList);
		const middle = Math.floor(sorted.length / 2);
		return middle % 2 === 0 ? (sorted[middle][0].length + sorted[middle - 1][0].length) / 2 : sorted[middle][0].length;
	}

	sortedWordList(wordList: Record<string, number>): Array<[string, number]> {
		return Object.entries(wordList)
			.sort(([, a], [, b]) => b - a);
	}
}
