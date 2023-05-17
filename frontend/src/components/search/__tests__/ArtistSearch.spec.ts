import { mount } from '@vue/test-utils'
import ArtistSearch from '../ArtistSearch.vue'

describe('ArtistSearch', () => {
  it('renders properly', () => {
    const wrapper = mount(ArtistSearch)
    expect(wrapper).toBeTruthy()
  })

  it('contains a search input', () => {
    const wrapper = mount(ArtistSearch)
    expect(wrapper.find('input').exists()).toBe(true)
  })
})
