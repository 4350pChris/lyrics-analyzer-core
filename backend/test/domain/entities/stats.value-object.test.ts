import test from 'ava';
import {Stats} from '@/domain/entities/stats.value-object';

test('constructor', t => {
	t.notThrows(() => new Stats(1, 2, 3));
});
