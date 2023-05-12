import {type ModelType} from 'dynamoose/dist/General';
import {type ProcessModelItem} from '../models/process.model';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

export class DynamooseProcessRepository implements ProcessTrackerRepository {
	constructor(
		private readonly processModel: ModelType<ProcessModelItem>,
	) {}

	async start(processId: string, total: number): Promise<void> {
		await this.processModel.create({id: processId, total});
	}

	async decrement(processId: string, value: number): Promise<void> {
		// @ts-expect-error - dynamoose types are not up to date
		await (this.processModel.update({id: processId}, {$ADD: {total: -value}}) as Promise<void>); // eslint-disable-line @typescript-eslint/naming-convention
	}

	async get(processId: string): Promise<number> {
		const item = await this.processModel.get(processId);
		return item?.total;
	}

	async isRunning(processId: string): Promise<boolean> {
		try {
			const left = await this.get(processId.toString());
			return left > 0;
		} catch {
			return false;
		}
	}
}

