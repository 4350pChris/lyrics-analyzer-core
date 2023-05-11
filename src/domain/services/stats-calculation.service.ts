import {Stats} from '../entities/stats.entity';

export class StatsCalculationService {
	constructor(
		private readonly wordList: Record<string, number>,
	) {}

	calculateStats(): Stats {
		return new Stats(
			this.calculateUniqueWords(),
			this.calculateAverageLengthOfWords(),
			this.calculateMedianLengthOfWords(),
		);
	}

	getTopWords(x: number): Array<[string, number]> {
		return this.sortedWordList().slice(0, x);
	}

	private calculateUniqueWords(): number {
		return Object.keys(this.wordList).length;
	}

	private calculateAverageLengthOfWords(): number {
		const totalLength = Object.entries(this.wordList)
			.reduce((acc, [word, count]) => acc + (word.length * count), 0);
		const totalWords = Object.values(this.wordList).reduce((acc, count) => acc + count, 0);
		return totalLength / totalWords;
	}

	private calculateMedianLengthOfWords(): number {
		const sorted = this.sortedWordList();
		const middle = Math.floor(sorted.length / 2);
		if (middle % 2 === 0) {
			return (sorted[middle][0].length + sorted[middle - 1][0].length) / 2;
		}

		return sorted[middle][0].length;
	}

	private sortedWordList(): Array<[string, number]> {
		return Object.entries(this.wordList)
			.sort(([, a], [, b]) => b - a);
	}
}
