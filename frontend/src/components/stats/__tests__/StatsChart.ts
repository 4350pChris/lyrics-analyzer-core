import { mount } from '@vue/test-utils'
import StatsChart from '../StatsChart.vue'

describe('StatsChart', () => {
  it('renders', () => {
    const wrapper = mount(StatsChart)
    expect(wrapper.exists()).toBe(true)
  })
})
