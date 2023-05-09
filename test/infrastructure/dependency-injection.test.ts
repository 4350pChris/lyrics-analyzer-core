import test from 'ava';
import {setupDependencyInjection} from '@/presentation/libs/dependency-injection';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

test('should setup dependency injection and not fail', t => {
	setupDependencyInjection();
	t.pass();
});

test('should setup dependency injection and resolve services', t => {
	const container = setupDependencyInjection();
	const artistRepository = container.resolve<ArtistRepository>('artistRepository');
	t.truthy(artistRepository);
});
