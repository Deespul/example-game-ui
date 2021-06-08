import { shallowMount } from '@vue/test-utils'
import TemplateComponent from '@/components/TemplateComponent.vue'

describe('TemplateComponent.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(TemplateComponent, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
