const {
  watch,
  ref
} = SUGAR;

const pageNation = {
  name: 'sugar-pagination',
  render: `
      <div class="sugar-pagination" :style="style">
        <ul class="sugar-pagination__items">
            <li s-if="showBtn" class="sugar-pagination__item" @click="prev">
                <svg t="1741916731985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2581" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" :fill="canPrev?'#333':'#8a8a8a'"></path></svg>
            </li>
            <li @click="changePage(item)" :class="pi === item ? 'sugar-pagination__item sugar-pagination__item--active':'sugar-pagination__item'"  s-for="(item,index) in page">
              <button>{{item}}</button>
            </li>
            <li s-if="showBtn" class="sugar-pagination__item right_arrow" @click="next">
                <svg t="1741916731985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2581" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" :fill="canNext?'#333':'#8a8a8a'"></path></svg>
            </li>
        </ul>
      </div>
  `,
  bulk (ctx: any) {
    const pi = ref(1) as any;
    const ps = ref(20) as any;
    const total = ref(0) as any;
    const page = ref([1]) as any;
    const canNext = ref(false) as any;
    const canPrev = ref(false) as any;
    const showBtn = ref(false) as any;
    const showMost = ref(false) as any;

    function changePage (v) {
      ctx.change(v);
    }

    function prev () {
      if (pi.value > 1) {
        ctx.change(pi.value - 1);
      }
    }

    function next () {
      if (pi.value < Math.ceil(total.value / ps.value)) {
        ctx.change(pi.value + 1);
      }
    }

    function generateNumberParts (f: number, n: number, c: number): number[] {
      f = Number(f);
      n = Number(n);
      c = Number(c);
      const front = [];
      for (let i = 1; i <= n; i++) {
        const tmp = f - i;
        if (tmp > 0) {
          front.unshift(tmp);
        }
      }
      const end = [];
      for (let i = 1; i <= (n + (n - front.length)); i++) {
        const tmp = f + i;
        if (tmp <= c) {
          end.push(tmp);
        }
      }

      if (end.length < n) {
        const length = front.length;
        for (let i = 1; i <= (n - end.length); i++) {
          const tmp = f - length - i;
          if (tmp > 0) {
            front.unshift(tmp);
          }
        }
      }

      return [...front, f, ...end];
    }

    update();

    watch(ctx, () => {
      update();
    });

    function update () {
      ps.value = ctx.ps;
      pi.value = ctx.pi;
      total.value = ctx.total;
      page.value = generateNumberParts(pi.value, ctx.page, Math.ceil(total.value / ps.value));

      canPrev.value = pi.value > 1;
      canNext.value = pi.value < Math.ceil(total.value / ps.value);
      ctx.btn && (showBtn.value = ctx.btn);
      ctx['show-most'] && (showMost.value = ctx['show-most']);
      if (showMost.value && !page.value.includes(1)) {
        page.value = [1, ...page.value];
      }
      if (showMost.value && !page.value.includes(Math.ceil(total.value / ps.value))) {
        page.value = [...page.value, Math.ceil(total.value / ps.value)];
      }
    }

    return {
      pi,
      ps,
      total,
      page,
      style: ctx.style,
      canNext,
      canPrev,
      changePage,
      showBtn,
      prev,
      next
    };
  }
};

export default pageNation;
