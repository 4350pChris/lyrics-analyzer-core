import {randomUUID} from 'node:crypto';
import {BaseEntity} from './base.entity.js';
import {Song} from './song.entity.js';

export class SongChunk extends BaseEntity {
	static unserialize(s: string) {
		const data = JSON.parse(s) as {id: string; songs: Array<{id: number; name: string; url: string}>};
		const chunk = new SongChunk(data.id);
		for (const song of data.songs) {
			chunk.addSong(song.id, song.name, song.url);
		}

		return chunk;
	}

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

	serialize() {
		return JSON.stringify({
			id: this.id,
			songs: this.songs.map(song => ({
				id: song.id,
				name: song.name,
				url: song.url,
			})),
		});
	}
}
