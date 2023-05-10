export type ProcessTracker = {
	start(processId: number | string, total: number): Promise<void>;
	progress(processId: number | string, current: number): Promise<void>;
	isRunning(processId: number | string,): Promise<boolean>;
	isFinished(processId: number | string,): Promise<boolean>;
};
