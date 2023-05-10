export type ProcessTracker = {
	start(): Promise<void>;
	progress(): Promise<void>;
	isRunning(): Promise<boolean>;
	isFinished(): Promise<boolean>;
};
