import {type GeniusResponse} from './genius-response.dto.js';

export type ArtistDetailResponse = GeniusResponse<{
	artist: {
		id: number;
		description: string;
		name: string;
		image_url?: string;
	};
}>;
