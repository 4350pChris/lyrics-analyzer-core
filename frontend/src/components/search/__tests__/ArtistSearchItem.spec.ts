import { mount } from '@vue/test-utils'
import ArtistSearchItem from '../ArtistSearchItem.vue'
import { type ArtistSearchResult } from '@/api/artists'

const makeArtist: () => ArtistSearchResult = () => ({
  id: 1,
  name: 'artist name',
  imageUrl: 'http://localhost'
})

const renderComponent = () => mount(ArtistSearchItem, { props: { artist: makeArtist() } })

describe('ArtistSearchItem', () => {
  it('renders properly', () => {
    const wrapper = renderComponent()
    expect(wrapper).toBeTruthy()
  })

  it('contains artist name', () => {
    const artist = makeArtist()
    const wrapper = renderComponent()
    expect(wrapper.text()).toContain(artist.name)
  })
})
