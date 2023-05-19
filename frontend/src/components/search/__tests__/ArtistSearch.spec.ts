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

  it('Calls search API on user input, debouncing by 250 ms', async () => {
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

  it('Emits update:modelValue when item is selected', async () => {
    const wrapper = mount(ArtistSearch)

    const spy = vi.spyOn(artistsExports, 'searchArtists')

    const artist = { id: 1, name: 'MF DOOM' }

    spy.mockResolvedValueOnce([artist])

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    await new Promise((resolve) => setTimeout(resolve, 250))

    const listItem = wrapper.get('[role=option]')

    expect(listItem).toBeTruthy()

    await listItem.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([artist])
  })
})
