import { onMounted, useEffect, useState } from '@sugar/sugar-hook';

const pagination = {
  name: 'sugar-pagination',
  render: `<div class="sugar-pagination">
                <div class="sugar-pagination-item">
                    <svg t="1735612924121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4375" width="10" height="10"><path d="M614.213818 71.819636a58.181818 58.181818 0 0 1 77.940364 86.318546l-3.095273 2.792727-379.880727 319.092364a34.909091 34.909091 0 0 0-4.282182 49.198545l1.861818 2.024727 1.978182 1.861819 381.021091 330.589091A58.181818 58.181818 0 0 1 616.750545 954.181818l-3.258181-2.629818L232.494545 621.032727a151.272727 151.272727 0 0 1-2.56-226.280727l4.398546-3.816727L614.213818 71.819636z" fill="#666" p-id="4376"></path></svg>
                </div>
                <div :class="pi === item ? 'sugar-pagination-item active':'sugar-pagination-item'" s-for="item in pageArr" @click="changePage(item)">{{item}}</div>
                <div class="sugar-pagination-item right">
                    <svg t="1735612924121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4375" width="10" height="10"><path d="M614.213818 71.819636a58.181818 58.181818 0 0 1 77.940364 86.318546l-3.095273 2.792727-379.880727 319.092364a34.909091 34.909091 0 0 0-4.282182 49.198545l1.861818 2.024727 1.978182 1.861819 381.021091 330.589091A58.181818 58.181818 0 0 1 616.750545 954.181818l-3.258181-2.629818L232.494545 621.032727a151.272727 151.272727 0 0 1-2.56-226.280727l4.398546-3.816727L614.213818 71.819636z" fill="#666" p-id="4376"></path></svg>
                </div>
            <div>`,
  bulk (ctx) {
    const [pi, setPi] = useState(1) as any;
    const [ps, setPs] = useState(20) as any;
    const [total, setTotal] = useState(0) as any;
    const [pages, setPages] = useState(0) as any;
    const [pageArr, setPageArr] = useState([]) as any;

    useEffect(() => {
      setPs(ctx.ps.value);
      setPi(ctx.pi.value);
      setTotal(ctx.total.value);
      setPages(Math.ceil(ctx.total.value / ctx.ps.value));
      pages.value > 0 && setPageArr(Array.from({ length: pages.value }, (v, k) => k + 1));
    }, [ctx.ps, ctx.pi, ctx.total], true);

    function changePage (v) {
      ctx.change(v);
    }

    return {
      pi,
      ps,
      pageArr,
      changePage
    };
  }
};

export default pagination;
