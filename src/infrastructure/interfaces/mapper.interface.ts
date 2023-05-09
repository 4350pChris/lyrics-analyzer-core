import type {AnyItem} from 'dynamoose/dist/Item';
import type {AggregateRoot} from '@/domain/interfaces/aggregate-root.interface';

export type Mapper<T extends AggregateRoot, M = Partial<AnyItem>> = {
	toDomain(item: M): T;
	toModel(item: T): M;
};
