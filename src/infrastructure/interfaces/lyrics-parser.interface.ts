export type LyricsParser = {
	parse: (html: string) => string;
	sanitize: (artist: string, text: string) => string;
};
