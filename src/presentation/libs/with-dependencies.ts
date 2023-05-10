import {setupDependencyInjection} from './dependency-injection';

export function withDependencies<T = any>(factory: (...args: any[]) => T): T {
	const container = setupDependencyInjection();
	return container.build(factory);
}

