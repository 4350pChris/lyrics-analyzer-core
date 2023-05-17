import {type GeniusResponse} from './genius-response.dto';

export type GeniusArtistDetailResponse = GeniusResponse<{
	artist: {
		id: number;
		description: {
			plain: string;
		};
		name: string;
		image_url?: string;
	};
}>;
