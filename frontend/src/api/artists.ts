export type ArtistSearchResult = {
  id: number
  name: string
  imageUrl?: string
}

export type ArtistListResult = {
  artists: {
    id: number
    name: string
    description: string
    imageUrl?: string
  }
}

const makeUrl = (path: string) => new URL(`/artists${path}`, import.meta.env.VITE_API_BASE_URL)

const fetchGet = async <T>(path: string) => {
  const url = makeUrl(path)
  const result = await fetch(url)
  const data = await result.json()

  if (!result.ok) throw new Error(data.message)

  return data as T
}

export const searchArtists = () => fetchGet<ArtistSearchResult>('/search')

export const listArtists = async () => {
  const data = await fetchGet<ArtistListResult>('/')

  return data.artists
}
