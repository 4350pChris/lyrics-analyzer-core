import { BaseEntity } from './BaseEntity.js';

export class Stats extends BaseEntity {
  constructor(
    public artistId: number,
    public wordList: Record<string, number>,
    public uniqueWords?: number,
  ) {
    super();
  }

  public calculateUniqueWords(): void {
    this.uniqueWords = Object.keys(this.wordList).length;
  }
}
