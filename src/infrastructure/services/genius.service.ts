import type {GeniusApi} from '../interfaces/genius-api.interface.js';
import type {LyricsParser} from '../interfaces/lyrics-parser.interface.js';
import {GeniusLyricsParser} from './genius-lyrics-parser.service.js';
import type {SongDto} from '@/application/dtos/song.dto.js';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto.js';
import type {LyricsApiService} from '@/application/interfaces/lyrics-api.interface.js';
import {type ArtistDetailDto} from '@/application/dtos/artist-detail.dto.js';

export class GeniusService implements LyricsApiService {
	constructor(
		private readonly geniusApiClient: GeniusApi,
		private readonly parser: LyricsParser = new GeniusLyricsParser(),
	) {}

	async getArtist(artistId: number): Promise<ArtistDetailDto> {
		const {response} = await this.geniusApiClient.getArtist(artistId);
		return response.artist;
	}

	async searchArtists(query: string): Promise<SearchArtistsDto[]> {
		const {response} = await this.geniusApiClient.search(query);
		const allArtists = response.hits.map(
			({result}) => {
				const artist: SearchArtistsDto = {
					id: result.primary_artist.id,
					name: result.primary_artist.name,
					imageUrl: result.primary_artist.image_url,
				};
				return [result.primary_artist.id, artist] as const;
			});

		// This removes duplicates
		const artists: Record<number, SearchArtistsDto> = Object.fromEntries(allArtists);
		return Object.values(artists);
	}

	async retrieveSongsForArtist(artistId: number): Promise<SongDto[]> {
		const songs: SongDto[] = [];
		let page: number | undefined = 1;

		// Consume all pages
		while (page) {
			// eslint-disable-next-line no-await-in-loop
			const {response} = await this.geniusApiClient.getSongsForArtist(artistId, page);
			// Evict songs where the artist is not the primary one
			const byArtist = response.songs.filter(song => song.primary_artist.id === artistId);
			const dtos: SongDto[] = byArtist.map(song => ({
				id: song.id,
				title: song.title_with_featured,
				url: song.url,
			}));
			songs.push(...dtos);
			page = response.next_page;
		}

		return songs;
	}

	async parseLyrics(url: URL): Promise<string> {
		const html = await this.geniusApiClient.getSong(url);
		const lyrics = this.parser.parse(html);
		return lyrics;
	}
}
