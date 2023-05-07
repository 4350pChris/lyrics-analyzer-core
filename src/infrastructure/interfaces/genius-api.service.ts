import type {GeniusSong} from './genius-song';

export type GeniusApiService = {
	search: (query: string) => Promise<GeniusSong[]>;
};
