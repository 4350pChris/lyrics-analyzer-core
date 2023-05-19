import { mount } from '@vue/test-utils'
import * as artistsExports from '@/api/artists'
import ArtistSearch from '../ArtistSearch.vue'

describe('ArtistSearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders properly', () => {
    const wrapper = mount(ArtistSearch)
    expect(wrapper).toBeTruthy()
  })

  it('contains a search input', () => {
    const wrapper = mount(ArtistSearch)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('calls search API on user input, debouncing by 250 ms', async () => {
    const wrapper = mount(ArtistSearch)

    const spy = vi.spyOn(artistsExports, 'searchArtists').mockResolvedValue([])

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    expect(spy).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith('query')
  })

  it('contains "Nothing found." if the API returns no results', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockResolvedValue([])

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(wrapper.text()).toContain('Nothing found.')
  })

  it('renders child components for results', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockResolvedValue([
      {
        id: 1,
        name: 'MF DOOM'
      }
    ])

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(wrapper.text()).toContain('MF DOOM')
  })

  it('contains "Error while searching." if the API call throws', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockRejectedValue(new Error('error'))

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(wrapper.text()).toContain('Error while searching.')
  })

  it('contains "Error while searching." if the API call throws even when results had been found earlier', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockResolvedValueOnce([
      {
        id: 1,
        name: 'MF DOOM'
      }
    ])

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    await new Promise((resolve) => setTimeout(resolve, 250))

    vi.spyOn(artistsExports, 'searchArtists').mockRejectedValue(new Error('error'))

    await input.setValue('another')
    await input.trigger('change')

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(wrapper.text()).toContain('Error while searching.')
  })
})
