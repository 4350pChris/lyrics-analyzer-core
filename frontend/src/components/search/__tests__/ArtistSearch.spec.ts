import { DOMWrapper, mount } from '@vue/test-utils'
import * as artistsExports from '@/api/artists'
import ArtistSearch from '../ArtistSearch.vue'

const changeInputValue = async (
  input: Omit<DOMWrapper<HTMLInputElement>, 'exists'>,
  value: string
) => {
  await input.setValue(value)
  await input.trigger('change')
}

const waitForDebounce = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250))
}

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

    await changeInputValue(input, 'query')

    expect(spy).not.toHaveBeenCalled()

    await waitForDebounce()

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith('query')
  })

  it('contains "Nothing found." if the API returns no results', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockResolvedValue([])

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await changeInputValue(input, 'query')

    await waitForDebounce()

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

    await changeInputValue(input, 'query')

    await waitForDebounce()

    expect(wrapper.text()).toContain('MF DOOM')
  })

  it('contains "Error while searching." if the API call throws', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockRejectedValue(new Error('error'))

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await changeInputValue(input, 'query')

    await waitForDebounce()

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

    await changeInputValue(input, 'query')

    await waitForDebounce()

    vi.spyOn(artistsExports, 'searchArtists').mockRejectedValue(new Error('error'))

    await changeInputValue(input, 'another query')

    await waitForDebounce()

    expect(wrapper.text()).toContain('Error while searching.')
  })

  it('Calls api method to add artist when artist is selected', async () => {
    const wrapper = mount(ArtistSearch)

    vi.spyOn(artistsExports, 'searchArtists').mockResolvedValue([
      {
        id: 1,
        name: 'MF DOOM'
      }
    ])

    const spy = vi.spyOn(artistsExports, 'addArtist').mockResolvedValue(undefined)

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await changeInputValue(input, 'query')

    await waitForDebounce()

    await wrapper.get('li').trigger('click')

    expect(spy).toHaveBeenCalledOnce()
  })
})
