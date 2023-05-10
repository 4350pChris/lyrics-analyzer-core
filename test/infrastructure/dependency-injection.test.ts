import test, {type Macro, type ExecutionContext} from 'ava';
import {setupDependencyInjection} from '@/presentation/libs/dependency-injection';

test('should setup dependency injection and not fail', t => {
	setupDependencyInjection();
	t.pass();
});

const resolvingMacro: Macro<[string]> = {
	exec(t: ExecutionContext, service: string) {
		const container = setupDependencyInjection();
		const resolved = container.resolve<unknown>(service);
		t.truthy(resolved);
	},
	title: (_: string | undefined, service: string) => `should resolve ${service}`,
};

const services = [
	'artistRepository',
	'geniusBaseUrl',
	'geniusApiClient',
	'lyricsApiService',
	'artistMapper',
	'artistModel',
	'sqs',
	'queueService',
	'processModel',
	'processRepository',
	'processTracker',
	'searchArtistsUseCase',
	'listArtistsUseCase',
	'analyzeLyricsUseCase',
	'fetchSongsUseCase',
	'parseLyricsUseCase',
];

for (const service of services) {
	test(resolvingMacro, service);
}
