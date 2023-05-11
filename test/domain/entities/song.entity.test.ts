import test from 'ava';
import {Song} from '@/domain/entities/song.entity';

const makeSong = (name: string, text: string) => new Song(1, name, text);

test('Create song', t => {
	const song = makeSong('name', 'text');
	t.is(song.name, 'name');
	t.is(song.text, 'text');
});

