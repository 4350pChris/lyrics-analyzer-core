export type ArtistSearchResult = {
  id: number
  name: string
  imageUrl?: string
}

export type ArtistListResult = {
  id: number
  name: string
  description: string
  imageUrl?: string
}

const makeUrl = (path: string) => new URL(`/artists${path}`, import.meta.env.VITE_API_BASE_URL)

const fetchAndParse = async <T>(url: URL, init?: RequestInit) => {
  const result = await fetch(url, init)
  const data = await result.json()

  if (!result.ok) throw new Error(data.message)

  return data as T
}

export const searchArtists = async (query: string) => {
  const url = makeUrl('/search')
  url.searchParams.append('query', query)

  const { artists } = await fetchAndParse<{ artists: ArtistSearchResult[] }>(url)

  return artists
}

export const listArtists = async () => {
  const url = makeUrl('')

  const { artists } = await fetchAndParse<{ artists: ArtistListResult[] }>(url)

  return artists
}
