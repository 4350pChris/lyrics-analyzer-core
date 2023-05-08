import test from 'ava';
import {setupDependencyInjection} from '@/infrastructure/dependency-injection.js';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface.js';

test('should setup dependency injection and not fail', t => {
	setupDependencyInjection();
	t.pass();
});

test('should setup dependency injection and resolve services', t => {
	const container = setupDependencyInjection();
	const artistRepository = container.resolve<ArtistRepository>('artistRepository');
	t.truthy(artistRepository);
});
