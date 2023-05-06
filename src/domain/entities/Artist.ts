import type { AggregateRoot } from '../interfaces/AggregateRoot.js';
import { BaseEntity } from './BaseEntity.js';
import { Song } from './Song.js';

export class Artist extends BaseEntity implements AggregateRoot {
  constructor(
    public name: string,
    public description: string,
    public imageUrl?: string,
    public songs: Song[] = [],
  ) {
    super();
  }

  public addSong(song: Song): void {
    this.songs.push(song);
  }

  public getCombinedWordList(): Record<string, number> {
    const wordLists = this.songs.map((song) => song.getWordList());
    return wordLists.reduce((acc, wordList) => {
      Object.entries(wordList).forEach(([word, count]) => {
        const currentCount = acc[word] || 0;
        acc[word] = currentCount + count;
      });
      return acc;
    }, {} as Record<string, number>);
  }
}
