import { mount } from '@vue/test-utils'
import { searchArtists } from '@/api/artists'
import ArtistSearch from '../ArtistSearch.vue'

const mountComponent = () => mount(ArtistSearch)

describe('ArtistSearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders properly', () => {
    const wrapper = mountComponent()
    expect(wrapper).toBeTruthy()
  })

  it('contains a search input', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('Calls search API on user input, debouncing by 250 ms', async () => {
    const wrapper = mountComponent()

    vi.mock('@/api/artists', () => ({
      searchArtists: vi.fn()
    }))

    const input = wrapper.get('input')

    expect(input).toBeTruthy()

    await input.setValue('query')
    await input.trigger('change')

    expect(searchArtists).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(searchArtists).toHaveBeenCalledOnce()
    expect(searchArtists).toHaveBeenCalledWith('query')
  })
})
