interface Core {
  bulk: Function;
  name?: string;
  render?: string | HTMLElement;
  renderDom?: HTMLElement;
  props?: any;
  appId?: any;
  components?: any;
  pId?: any;
  ctx?: object;
  forArr?: any[];
  el?: any;
  slot?: any;
}

export type { Core };
