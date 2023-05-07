import type {AnyItem} from 'dynamoose/dist/Item.js';
import type {AggregateRoot} from '../../domain/interfaces/aggregate-root.js';

export type Mapper<T extends AggregateRoot, M = Partial<AnyItem>> = {
	toDomain(item: M): T;
	toModel(item: T): M;
};
