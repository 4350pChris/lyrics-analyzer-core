import {type Stats} from '@/domain/entities/stats.value-object';

export type ArtistDetailDto = {
	id: number;
	name: string;
	description: string;
	imageUrl?: string;
	stats?: Stats;
};
