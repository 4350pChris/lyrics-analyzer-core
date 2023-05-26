import { ofetch } from 'ofetch'

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

const artistFetch = ofetch.create({ baseURL: import.meta.env.VITE_API_BASE_URL + '/artists' })

export const searchArtists = async (query: string) => {
  const { artists } = await artistFetch<{ artists: ArtistSearchResult[] }>('/search', {
    params: { query }
  })

  return artists
}

export const listArtists = async () => {
  const { artists } = await artistFetch<{ artists: ArtistListResult[] }>('')

  return artists
}

export const addArtist = async (artistId: number) => {
  await artistFetch('', {
    method: 'POST',
    body: { artistId }
  })
}
