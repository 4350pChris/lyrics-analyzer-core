import {randomUUID} from 'node:crypto';
import {BaseEntity} from './base.entity.js';
import {Song} from './song.entity.js';

export class SongChunk extends BaseEntity {
	public readonly songs: Song[] = [];

	constructor(
		public readonly id?: string,
	) {
		super();
		if (!id) {
			this.id = randomUUID();
		}
	}

	addSong(id: number, title: string, url: string) {
		const song = new Song(id, title, '', url);
		this.songs.push(song);
	}
}
