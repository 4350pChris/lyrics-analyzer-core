import {type Song} from '../entities/song.entity';
import {Stats} from '../entities/stats.value-object';
import {type StatisticsCalculator} from '../interfaces/statistics-calculator.interface';

type WordList = Array<[string, number]>;

export class ConcreteStatisticsCalculator implements StatisticsCalculator {
	calculateStats(songs: Song[]): Stats {
		const wordList = this.getCombinedWordList(songs);
		return new Stats(
			this.calculateUniqueWords(wordList),
			this.calculateAverageLengthOfWords(wordList),
			this.calculateMedianLengthOfWords(wordList),
		);
	}

	getCombinedWordList(songs: Song[]): WordList {
		const wordList: Record<string, number> = {};
		for (const song of songs) {
			const split = song.text.split(/\s+/);
			for (const word of split) {
				const currentCount = wordList[word] || 0;
				wordList[word] = currentCount + 1;
			}
		}

		return this.sortedWordList(wordList);
	}

	calculateUniqueWords(wordList: WordList): number {
		return wordList.length;
	}

	calculateAverageLengthOfWords(wordList: WordList): number {
		let totalLength = 0;
		let totalWords = 0;

		for (const [word, count] of wordList) {
			totalLength += word.length * count;
			totalWords += count;
		}

		return totalLength / totalWords;
	}

	calculateMedianLengthOfWords(wordList: WordList): number {
		const middle = Math.floor(wordList.length / 2);
		return middle % 2 === 0 ? (wordList[middle][0].length + wordList[middle - 1][0].length) / 2 : wordList[middle][0].length;
	}

	sortedWordList(wordList: Record<string, number>): Array<[string, number]> {
		return Object.entries(wordList)
			.sort(([, a], [, b]) => b - a);
	}
}
