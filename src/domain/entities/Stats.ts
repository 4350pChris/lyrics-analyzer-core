import { BaseEntity } from './BaseEntity.js';

export class Stats extends BaseEntity {
  constructor(
    public id: number,
    public artistId: number,
    public wordList: Record<string, number>,
    public uniqueWords?: number,
  ) {
    super(id);
  }

  public calculateUniqueWords(): void {
    this.uniqueWords = Object.keys(this.wordList).length;
  }
}
