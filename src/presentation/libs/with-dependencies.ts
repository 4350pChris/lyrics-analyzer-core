import {container} from '@/application/dependency-injection';

export function withDependencies<T = any>(factory: (...args: any[]) => T): T {
	return container.build(factory);
}

