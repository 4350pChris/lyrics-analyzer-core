export type ProcessTrackerRepository = {
	start(processId: number, total: number): Promise<void>;
	decrement(processId: number, value: number): Promise<void>;
	isRunning(processId: number): Promise<boolean>;
	delete(processId: number): Promise<void>;
};
