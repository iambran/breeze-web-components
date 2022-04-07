import randomID from '../random-id/index.js'

class BreezeTabs extends HTMLElement {
  static get abservedAttributes() {
    return []
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.addEventListener('click', this.switchTabs)
  }

  connectedCallback() {
    this.render()

    console.log(this.tabs)
    console.log(this.panels)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== null) {
      this.render()
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class='tabs'>
        <slot name='tab'>Default Tab Title</slot>
      </div>
      <div class="panels">
        <slot name='panel'>Default Panel Content</slot>
      </div>
      <style>
        ::slotted([slot="panel"]) {
          display: none;
        }
        ::slotted([slot="panel"].breeze-active) {
          display: block;
        }
      </style>
    `
    this.tabs = this.shadowRoot.querySelector('slot[name="tab"]').assignedElements({flatten: true})
    this.panels = this.shadowRoot.querySelector('slot[name="panel"]').assignedElements({flatten: true})
    if (this.tabs.length !== this.panels.length) {
      console.error('tab slots and panel slots numbers need to match');
    }
    for (let i=0; i < this.tabs.length; i++) {
      let id = randomID()
      this.tabs[i].dataset.id = id
      this.panels[i].dataset.id = id
      if (i === 0) {
        this.tabs[i].classList.add(`breeze-active`)
        this.panels[i].classList.add(`breeze-active`)
      }
    }
  }

  switchTabs(e) {
    if (e.target.matches('[slot="tab"]')) {
      let activeTab = this.tabs.find(tab => tab.classList.contains('breeze-active'))
      let activePanel = this.panels.find(tab => tab.classList.contains('breeze-active'))
      if (activeTab && activePanel) {
        activeTab.classList.remove('breeze-active')
        activePanel.classList.remove('breeze-active')
      }
      activeTab = e.target
      activeTab.classList.add('breeze-active')
      activePanel = this.panels.find(panel => panel.dataset.id === activeTab.dataset.id)
      activePanel.classList.add('breeze-active')
    }
  }
}

customElements.define('breeze-tabs', BreezeTabs)
export default BreezeTabs
