import {type GeniusResponse} from './genius-response.dto';

export type ArtistDetailResponse = GeniusResponse<{
	artist: {
		id: number;
		description: string;
		name: string;
		image_url?: string;
	};
}>;
