export type ProcessTracker = {
	start(processId: number | string, total: number): Promise<void>;
	decrement(processId: number | string, value: number): Promise<void>;
	isRunning(processId: number | string,): Promise<boolean>;
	isFinished(processId: number | string,): Promise<boolean>;
};
