import {type ProcessTableRepository} from '../interfaces/process-tracker-repository.interface';
import {type ProcessTracker} from '../interfaces/process-tracker.interface';

export class ArtistProcessTracker implements ProcessTracker {
	constructor(
		private readonly processId: string | number,
		private readonly total: number,
		private readonly processRepository: ProcessTableRepository,
	) {}

	async start(): Promise<void> {
		await this.processRepository.save(this.processId.toString(), this.total);
	}

	async progress(): Promise<void> {
		await this.processRepository.update(this.processId.toString(), this.total);
	}

	async isRunning(): Promise<boolean> {
		const left = await this.processRepository.get(this.processId.toString());
		return left > 0;
	}

	async isFinished(): Promise<boolean> {
		return !(await this.isRunning());
	}
}
