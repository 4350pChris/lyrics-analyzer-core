import { BaseEntity } from './BaseEntity.js';

export class Stats {
  
  private _uniqueWords : number = 0;
  public get uniqueWords() : number {
    return this._uniqueWords;
  }
  public set uniqueWords(v : number) {
    this._uniqueWords = v;
  }

  
  private _averageLength : number = 0;
  public get averageLength() : number {
    return this._averageLength;
  }
  public set averageLength(v : number) {
    this._averageLength = v;
  }

  private _medianLength : number = 0;
  public get medianLength() : number {
    return this._medianLength;
  }
  public set medianLength(v : number) {
    this._medianLength = v;
  }
  
  constructor(
    public wordList: Record<string, number>,
  )
  {}

  private sortedWordList(): [string, number][] {
    return Object.entries(this.wordList)
      .sort(([, a], [, b]) => b - a);
  }

  public calculateUniqueWords(): void {
    this.uniqueWords = Object.keys(this.wordList).length;
  }

  public calculateAverageLengthOfWords(): void {
    const totalLength = Object.entries(this.wordList)
      .reduce((acc, [word, count]) => acc + word.length * count, 0);
    const totalWords = Object.values(this.wordList).reduce((acc, count) => acc + count, 0)
    this.averageLength = totalLength / totalWords;
  }

  public getTopXWords(x: number): [string, number][] {
    return this.sortedWordList().slice(0, x);
  }

  public calculateMedianLengthOfWords(): void {
    const sorted = this.sortedWordList()
    const middle = Math.floor(sorted.length / 2);
    if (middle % 2 === 0) {
      this.medianLength = (sorted[middle][0].length + sorted[middle - 1][0].length) / 2;
    } else {
      this.medianLength = sorted[middle][0].length;
    }
  }
}
