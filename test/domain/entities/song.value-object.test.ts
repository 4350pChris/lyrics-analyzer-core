import test from 'ava';
import {Song} from '@/domain/entities/song.value-object.js';

const makeSong = (name: string, text: string) => new Song(name, text);

test('Create song', t => {
	const song = makeSong('name', 'text');
	t.is(song.name, 'name');
	t.is(song.text, 'text');
});

