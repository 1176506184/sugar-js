interface Core {

  bulk: Function
  name?: string
  render?: string | HTMLElement
  renderDom: HTMLElement
  props?: any
  appId?: any
  components?: any
  pId?: any
  ctx?: Object
  forArr: any[]
  el?: any
  slot?: any
  ssr: boolean
  ssrVNode: any
  ssrRender: any
}

export type { Core };
