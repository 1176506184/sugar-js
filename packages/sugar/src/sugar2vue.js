const dialog = window.Vue.defineComponent({
  props: {
    model: {
      type: Boolean
    },
    close: {
      type: Function
    }
  },
  emits: ['close'],
  setup (props, { emit }) {
    console.log(props);
    const [opacity, setOpacity] = useState(0);

    Vue.watch(props, () => {
      if (props.model) {
        setTimeout(() => {
          setOpacity(1);
        }, 50);
      } else {
        setOpacity(0);
      }
    });

    function close () {
      setOpacity(0);
      setTimeout(() => {
        emit('close');
      }, 300);
    }

    return {
      props,
      close,
      opacity
    };
  },
  template: `<div>
                    <div class="sugar-dialog-mode" :style="'opacity:'+opacity" v-if="props.model" @click.self="close">
                        <div class="sugar-dialog" s-if="show" @click.self="close">
                            <slot name="default"></slot>
                        </div>
                    </div>
            </div>`

});

function sugar2vue (SUGAR) {
  SUGAR.makeSugar = function (state) {
    return window.Vue.createApp({
      setup: state.bulk
    });
  };
  SUGAR.useState = function (initState) {
    const state = window.Vue.ref(initState);

    state.sugarDeps = [];

    function setState (newState) {
      state.value = newState;
      state.sugarDeps.forEach((dep) => {
        dep();
      });
    }

    return [state, setState];
  };

  SUGAR.useEffect = function (fun, deps = [], run = false) {
    deps.forEach((dep) => {
      dep.sugarDeps.push(fun);
    });
  };

  SUGAR.onMounted = window.Vue.onMounted;
  SUGAR.nextTick = window.Vue.nextTick;
  SUGAR.instance = window.Vue.ref;
  document.querySelectorAll('[instance]').forEach((item) => {
    item.setAttribute('ref', item.getAttribute('*instance'));
    item.removeAttribute('*instance');
  });
  document.querySelectorAll('[s-for]').forEach((item) => {
    item.setAttribute('v-for', item.getAttribute('s-for'));
    item.removeAttribute('s-for');
  });
  document.querySelectorAll('[s-if]').forEach((item) => {
    item.setAttribute('v-if', item.getAttribute('s-if'));
    item.removeAttribute('s-if');
  });
}

function sugarComponent2Vue (app) {
  app.install = function () {
  };
  app.component('sugar-dialog', dialog);
}

if (typeof window !== 'undefined') {
  (function (global) {
    global.sugar2vue = sugar2vue;
    global.sugarComponent2Vue = sugarComponent2Vue;
  })(window);
}
