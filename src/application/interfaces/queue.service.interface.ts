import {type FetchSongsDto} from '../dtos/fetch-songs.dto';
import {type WorkflowTriggerDto} from '../dtos/workflow-trigger.dto';

export type QueueService = {
	sendToFetchQueue(dto: WorkflowTriggerDto): Promise<void>;
	sendToParseQueue(dto: FetchSongsDto): Promise<void>;
};
