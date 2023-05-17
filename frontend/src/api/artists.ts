const makeUrl = (path: string) => new URL(`/artists${path}`, import.meta.env.VITE_API_BASE_URL)

export type ArtistSearchResult = {
  id: number
  name: string
  imageUrl?: string
}

export async function searchArtists() {
  const url = makeUrl('/search')
  // TODO: validation?
  const result = await fetch(url)
  const data = (await result.json()) as ArtistSearchResult[]

  return data
}
