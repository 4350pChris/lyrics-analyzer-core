import type middy from '@middy/core';
import {type Context} from 'aws-lambda';
import {type AwilixContainer} from 'awilix';
import {type Cradle, container} from '@/application/dependency-injection';

export type DependencyAwareContext<C extends Context = Context> = C & {container: AwilixContainer<Cradle>};

type DependencyMiddleware<
	Event = unknown,
	Result = any,
	E = Error,
> = () => middy.MiddlewareObj<Event, Result, E, DependencyAwareContext>;

export const withDependencies: DependencyMiddleware = () => ({
	before(request) {
		const {context} = request;
		context.container = container.createScope();
	},
});

