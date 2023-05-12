export type ProcessTrackerRepository = {
	start(processId: string, total: number): Promise<void>;
	decrement(processId: string, value: number): Promise<void>;
	isRunning(processId: string,): Promise<boolean>;
};
