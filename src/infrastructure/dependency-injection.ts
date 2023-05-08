import process from 'node:process';
import {createContainer, asClass, asValue, asFunction, InjectionMode} from 'awilix';
import {DynamooseArtistRepository} from './repositories/dynamoose-artist.repository.js';
import {GeniusService} from './services/genius.service.js';
import {ArtistMapper} from './mappers/artist.mapper.js';
import {getArtistModel} from './models/artist.model.js';
import {GeniusApiClient} from './clients/genius-api.client.js';

export const setupDependencyInjection = () => {
	const container = createContainer({
		injectionMode: InjectionMode.CLASSIC,
	});

	container.register({
		artistRepository: asClass(DynamooseArtistRepository).singleton(),
		geniusBearerToken: asValue(process.env.GENIUS_ACCESS_TOKEN),
		geniusBaseUrl: asValue('https://api.genius.com'),
		geniusApiClient: asClass(GeniusApiClient).singleton(),
		lyricsApiService: asClass(GeniusService).singleton(),
		artistMapper: asClass(ArtistMapper).singleton(),
		artistTableName: asValue(process.env.ARTIST_TABLE_NAME),
		artistModel: asFunction(getArtistModel).singleton(),
	});

	return container;
};
