import {ofetch} from 'ofetch';

export const createApiClient = (geniusBaseUrl: string, geniusAccessToken: string) => ofetch.create({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	baseURL: geniusBaseUrl,
	headers: {
		authorization: `Bearer ${geniusAccessToken}`,
	},
});
