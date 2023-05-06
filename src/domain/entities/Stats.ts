import { BaseEntity } from './BaseEntity.js';

export class Stats extends BaseEntity {
  constructor(
    public artistId: number,
    public wordList: Record<string, number>,
  ) {
    super();
  }

  private sortedWordList(): [string, number][] {
    return Object.entries(this.wordList)
      .sort(([, a], [, b]) => b - a);
  }

  public calculateUniqueWords(): number {
    return Object.keys(this.wordList).length;
  }

  public calculateAverageLengthOfWords(): number {
    const totalLength = Object.entries(this.wordList)
      .reduce((acc, [word, count]) => acc + word.length * count, 0);
    const totalWords = Object.values(this.wordList).reduce((acc, count) => acc + count, 0)
    return totalLength / totalWords;
  }

  public getTopXWords(x: number): [string, number][] {
    return this.sortedWordList().slice(0, x);
  }

  public calculateMedianLengthOfWords(): number {
    const sorted = this.sortedWordList()
    const middle = Math.floor(sorted.length / 2);
    if (middle % 2 === 0) {
      return (sorted[middle][0].length + sorted[middle - 1][0].length) / 2;
    }
    return sorted[middle][0].length;
  }
}
