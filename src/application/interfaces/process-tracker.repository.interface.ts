export type ProcessTrackerRepository = {
	start(processId: number | string, total: number): Promise<void>;
	decrement(processId: number | string, value: number): Promise<void>;
	isRunning(processId: number | string,): Promise<boolean>;
};
