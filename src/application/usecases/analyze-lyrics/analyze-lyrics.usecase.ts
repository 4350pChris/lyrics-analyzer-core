import type {UseCase} from '../usecase';
import {type AnalyzeLyricsDto} from '../../dtos/analyze-lyrics.dto';
import {type Queue} from '@/application/interfaces/queue.interface';

export class AnalyzeLyrics implements UseCase {
	constructor(
		private readonly queue: Queue,
	) {}

	async execute(artistId: string): Promise<void> {
		const dto: AnalyzeLyricsDto = {artistId};
		await this.queue.publish(JSON.stringify(dto));
	}
}
