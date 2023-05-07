export type GeniusResponse<T> = {
	meta: {
		status: number;
	};
	response: T;
};
