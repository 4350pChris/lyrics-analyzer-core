import { BaseEntity } from './BaseEntity.js';

export class Song extends BaseEntity {

  constructor(
  public name: string,
  public text: string,
  ) {
    super();
  }

  public getWordList(): Record<string, number> {
    return this.text.split(/\s+/)
      .reduce((acc, word) => {
        const count = acc[word] || 0;
        acc[word] = count + 1;
        return acc;
      }, {} as Record<string, number>);
  }
}
