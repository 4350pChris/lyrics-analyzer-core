import {type ProcessTableRepository} from '../interfaces/process-tracker-repository.interface';
import {type ProcessTracker} from '../interfaces/process-tracker.interface';

export class ArtistProcessTracker implements ProcessTracker {
	constructor(
		private readonly processRepository: ProcessTableRepository,
	) {}

	async start(processId: number | string, total: number): Promise<void> {
		await this.processRepository.save(processId.toString(), total);
	}

	async decrement(processId: number | string, value: number): Promise<void> {
		const oldValue = await this.processRepository.get(processId.toString());
		if (!oldValue) {
			throw new Error('Process not found');
		}

		await this.processRepository.update(processId.toString(), oldValue - value);
	}

	async isRunning(processId: number | string): Promise<boolean> {
		const left = await this.processRepository.get(processId.toString());
		return Boolean(left && left > 0);
	}

	async isFinished(processId: number | string): Promise<boolean> {
		return !(await this.isRunning(processId));
	}
}
