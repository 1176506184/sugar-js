let k = {}, N = "";
function Ft(t) {
  k[N] || (k[N] = []), k[N].push({
    used: !1,
    fun: t
  });
}
function Et(t) {
  N = t;
}
const Bt = Array.isArray, Ct = Object.assign;
function Gt(t) {
  return /^[A-Za-z_$][\w$]*$/.test(t);
}
function zt(t) {
  if (Gt(t))
    return !0;
  const e = ["(", ")", "=>", "+", "-", "*", "/", ".", "[", "]"];
  for (const n of e)
    if (t.includes(n))
      return !1;
  return !0;
}
const ot = [];
function lt(t) {
  ot.push(t);
}
function wt() {
  ot.pop();
}
function _t(t, e) {
  const n = ct(e), i = [];
  for (; !qt(t, e); ) {
    const s = t.source;
    let f;
    if (b(s, t.options.delimiters[0]))
      f = Kt(t);
    else if (s[0] === "<" && s.length !== 1)
      if (s[1] === "/")
        if (s[2] === ">") {
          E(t, 3);
          continue;
        } else if (/[a-z]/i.test(s[2])) {
          J(
            t,
            1
            /* End */
          );
          continue;
        } else
          f = mt(t);
      else /[a-z]/i.test(s[1]) ? f = Xt(t, e) : s[1] === "!" && (f = mt(t));
    if (f || (f = Qt(t)), Bt(f))
      for (let a = 0; a < f.length; a++)
        gt(i, f[a]);
    else
      gt(i, f);
  }
  let c = !1;
  const r = t.options.whitespace !== "preserve";
  for (let s = 0; s < i.length; s++) {
    const f = i[s];
    if (f.type === 2)
      if (t.inPre)
        f.content = f.content.replace(/\r\n/g, `
`);
      else if (/[^\t\r\n\f ]/.test(f.content))
        r && (f.content = f.content.replace(/[\t\r\n\f ]+/g, " "));
      else {
        const a = i[s - 1], g = i[s + 1];
        !a || !g || r && (a.type === 3 && g.type === 3 || a.type === 3 && g.type === 1 || a.type === 1 && g.type === 3 || a.type === 1 && g.type === 1 && /[\r\n]/.test(f.content)) ? (c = !0, i[s] = null) : f.content = " ";
      }
    else f.type === 3 && !t.options.comments && (c = !0, i[s] = null);
  }
  if (t.inPre && n && t.options.isPreTag(n.tag)) {
    const s = i[0];
    s && s.type === 2 && (s.content = s.content.replace(/^\r?\n/, ""));
  }
  return c ? i.filter(Boolean) : i;
}
function Dt(t, e) {
  const n = [], i = /* @__PURE__ */ new Set(), c = t.source.slice(0, t.source.indexOf(">")).match(/s-for\s*=\s*["']\s*\(([^)]+)\)\s+in\s+[^"']+["']/);
  if (c) {
    const r = c[1].split(",").map((s) => s.trim());
    lt(r);
  } else e === 0 && lt([]);
  for (; t.source.length > 0 && !b(t.source, ">") && !b(t.source, "/>"); ) {
    if (b(t.source, "/")) {
      E(t, 1), j(t);
      continue;
    }
    const r = Ht(t, i);
    if (["s-if", "s-html"].includes(r.name) && (r.value.content = G(r.value.content)), r.name === "s-for") {
      const s = r.value.content.split(" in ");
      r.value.content = s[0] + " in " + G(s[1]);
    }
    r.type === 6 && r.value && r.name === "class" && (r.value.content = r.value.content.replace(/\s+/g, " ").trim()), e === 0 && n.push(r), j(t);
  }
  return n;
}
function Ht(t, e) {
  const n = $(t), c = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(t.source)[0];
  e.add(c), E(t, c.length);
  let r;
  /^[\t\r\n\f ]*=/.test(t.source) && (j(t), E(t, 1), j(t), r = Wt(t));
  const s = v(t, n);
  if (!t.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(c)) {
    const f = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(c), a = b(c, "."), g = f[1] || (a || b(c, ":") ? "bind" : b(c, "@") || b(c, "s-on:") ? "on" : "slot");
    let o;
    if (f[2]) {
      const u = g === "slot", h = c.lastIndexOf(f[2], c.length - (f[3]?.length || 0)), m = v(
        t,
        ut(t, n, h),
        ut(
          t,
          n,
          h + f[2].length + (u && f[3] || "").length
        )
      );
      let p = f[2];
      p.startsWith("[") ? p.endsWith("]") ? p = p.slice(1, p.length - 1) : p = p.slice(1) : u && (p += f[3] || ""), o = {
        type: 4,
        content: p,
        loc: m
      };
    }
    if (r?.isQuoted) {
      const u = r.loc;
      u.start.offset++, u.start.column++, u.end = Ot(u.start, r.content), u.source = u.source.slice(1, -1);
    }
    const l = f[3] ? f[3].slice(1).split(".") : [];
    return a && l.push("prop"), {
      type: 7,
      name: g,
      exp: r && {
        type: 4,
        content: G(r.content),
        loc: r.loc,
        isStatic: !zt(r.content)
      },
      arg: o,
      modifiers: l,
      loc: s
    };
  }
  return {
    type: 6,
    name: c,
    value: r && {
      type: 2,
      content: r.content,
      loc: r.loc
    },
    loc: s
  };
}
function ut(t, e, n) {
  return Ot(
    e,
    t.originalSource.slice(e.offset, n),
    n
  );
}
function Wt(t) {
  const e = $(t);
  let n;
  const i = t.source[0], c = i === '"' || i === "'";
  if (c) {
    E(t, 1);
    const r = t.source.indexOf(i);
    r === -1 ? n = F(t, t.source.length) : (n = F(t, r), E(t, 1));
  } else {
    const r = /^[^\t\r\n\f >]+/.exec(t.source);
    if (!r)
      return;
    n = F(t, r[0].length);
  }
  return {
    content: n,
    isQuoted: c,
    loc: v(t, e)
  };
}
function gt(t, e) {
  if (e.type === 2) {
    const n = ct(t);
    if (n && n.type === 2 && n.loc.end.offset === e.loc.start.offset) {
      n.content += e.content, n.loc.end = e.loc.end, n.loc.source += e.loc.source;
      return;
    }
  }
  t.push(e);
}
function Xt(t, e) {
  ct(e);
  const n = J(
    t,
    0
    /* Start */
  );
  if (n.isSelfClosing || t.options.isVoidTag(n.tag))
    return n;
  e.push(n);
  const i = _t(t, e);
  return e.pop(), n.children = i, At(t.source, n.tag) && J(
    t,
    1
    /* End */
  ), n.loc = v(t, n.loc.start), n;
}
function J(t, e, n) {
  const i = $(t), c = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(t.source), r = c[1];
  E(t, c[0].length), j(t);
  const s = Dt(t, e);
  let f = !1;
  if (t.source.length !== 0 && (f = b(t.source, "/>"), E(t, f ? 2 : 1)), e === 1) {
    wt();
    return;
  }
  return {
    type: 1,
    tag: r,
    tagType: 0,
    children: [],
    props: s,
    isSelfClosing: f,
    loc: v(t, i)
  };
}
var bt = /* @__PURE__ */ ((t) => (t[t.HTML = 0] = "HTML", t))(bt || {});
function mt(t) {
  const e = $(t), n = t.source[1] === "?" ? 1 : 2;
  let i;
  const c = t.source.indexOf("-->") + 2;
  return c === -1 ? (i = t.source.slice(n), E(t, t.source.length)) : (i = t.source.slice(n, c), E(t, c + 1)), {
    type: 3,
    content: i,
    loc: v(t, e)
  };
}
function qt(t, e) {
  const n = t.source;
  if (b(n, "</")) {
    for (let i = e.length - 1; i >= 0; --i)
      if (At(n, e[i].tag))
        return !0;
  }
  return !n;
}
function Kt(t) {
  const [e, n] = t.options.delimiters, i = t.source.indexOf(n, e.length), c = $(t);
  E(t, e.length);
  const r = $(t), s = $(t), f = i - e.length, a = t.source.slice(0, f), g = Zt(t, f), o = g.trim(), l = g.indexOf(o);
  l > 0 && C(r, a, l);
  const u = f - (g.length - o.length - l);
  return C(s, a, u), E(t, n.length), {
    type: 5,
    content: {
      type: 4,
      content: G(o),
      loc: v(t, r, s)
    },
    loc: v(t, c)
  };
}
function Qt(t) {
  const e = ["<", t.options.delimiters[0]];
  let n = t.source.length;
  for (let r = 0; r < e.length; r++) {
    const s = t.source.indexOf(e[r], 1);
    s !== -1 && n > s && (n = s);
  }
  const i = $(t);
  return {
    type: 2,
    content: F(t, n),
    loc: v(t, i)
  };
}
function F(t, e) {
  const n = t.source.slice(0, e);
  return E(t, e), n;
}
function v(t, e, n) {
  return n = n || $(t), {
    start: e,
    end: n,
    source: t.originalSource.slice(e.offset, n.offset)
  };
}
function Zt(t, e) {
  const n = t.source.slice(0, e);
  return E(t, e), n;
}
function E(t, e) {
  const { source: n } = t;
  C(t, n, e), t.source = n.slice(e);
}
function C(t, e, n = e.length) {
  let i = 0, c = -1;
  for (let r = 0; r < n; r++)
    e.charCodeAt(r) === 10 && (i++, c = r);
  return t.offset += n, t.line += i, t.column = c === -1 ? t.column + n : n - c, t;
}
function Ot(t, e, n = e.length) {
  return C(Ct({}, t), e, n);
}
function j(t) {
  const e = /^[\t\r\n\f ]+/.exec(t.source);
  e && E(t, e[0].length);
}
function b(t, e) {
  return t.startsWith(e);
}
function At(t, e) {
  return b(t, "</") && t.slice(2, 2 + e.length).toLowerCase() === e.toLowerCase() && /[\t\r\n\f />]/.test(t[2 + e.length] || ">");
}
function ct(t) {
  return t[t.length - 1];
}
function $(t) {
  const { column: e, line: n, offset: i } = t;
  return {
    column: e,
    line: n,
    offset: i
  };
}
var A = /* @__PURE__ */ ((t) => (t[t.ROOT = 0] = "ROOT", t[t.ELEMENT = 1] = "ELEMENT", t[t.TEXT = 2] = "TEXT", t[t.COMMENT = 3] = "COMMENT", t[t.SIMPLE_EXPRESSION = 4] = "SIMPLE_EXPRESSION", t[t.INTERPOLATION = 5] = "INTERPOLATION", t[t.ATTRIBUTE = 6] = "ATTRIBUTE", t[t.DIRECTIVE = 7] = "DIRECTIVE", t[t.COMPOUND_EXPRESSION = 8] = "COMPOUND_EXPRESSION", t[t.COMPONENT = 9] = "COMPONENT", t[t.SLOT = 10] = "SLOT", t))(A || {});
const Jt = /* @__PURE__ */ new Set([
  // 原始值
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
  // 基本对象
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  // 数字与数学
  "Number",
  "BigInt",
  "Math",
  "Date",
  // 文本处理
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  // Keyed collections
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Web APIs & runtime globals
  "window",
  "globalThis",
  "console",
  "alert",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  // DOM
  "document",
  "location",
  "history",
  "navigator",
  // 新语言关键字等
  "await",
  "async",
  "arguments",
  "this"
]);
function G(t) {
  return t.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (e, n, i, c) => {
    const r = c.slice(0, i), s = /'[^']*$/.test(r) && /[^']*'/.test(c.slice(i)), f = /"[^"]*$/.test(r) && /[^"]*"/.test(c.slice(i)), a = /`[^`]*$/.test(r) && /[^`]*`/.test(c.slice(i));
    if (s || f || a) return e;
    const g = c[i - 1];
    return g === "." || g === ":" || Yt(n) || Jt.has(n) ? e : `_ctx_.${n}`;
  });
}
function $t(t) {
  const e = [];
  for (const n of t)
    Array.isArray(n) ? e.push(...$t(n)) : e.push(n);
  return e;
}
function Yt(t) {
  return $t(ot).includes(t);
}
const H = (t) => !1;
function Y(t) {
  const e = Vt(t);
  return _t(e, [])[0];
}
function Vt(t) {
  return {
    column: 1,
    line: 1,
    offset: 0,
    originalSource: t,
    source: t,
    inPre: !1,
    inVPre: !1,
    options: {
      delimiters: ["{{", "}}"],
      isVoidTag: H,
      isPreTag: H,
      isCustomElement: H,
      getNamespace: (e, n) => bt.HTML
    }
  };
}
const P = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  parentNode: (t) => t.parentNode
}, R = (t) => t instanceof Array;
function dt(t) {
  return t != null;
}
function W(t) {
  return t == null;
}
function te(t) {
  const e = {
    lt: "<",
    gt: ">",
    nbsp: " ",
    amp: "&",
    quot: '"'
  };
  return t.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(n, i) {
    return e[i];
  }).replace(/<[^>]+s-on:([^>]+)>/gi, function(n, i) {
    return n.replace(/s-on:/g, "@");
  });
}
const O = {
  Array: Array.isArray,
  Date: (t) => t instanceof Date,
  Set: (t) => Object.prototype.toString.call(t) === "[object Set]",
  Map: (t) => Object.prototype.toString.call(t) === "[object Map]",
  Object: (t) => Object.prototype.toString.call(t) === "[object Object]",
  Symbol: (t) => Object.prototype.toString.call(t) === "[object Symbol]",
  Function: (t) => Object.prototype.toString.call(t) === "[object Function]"
};
function I(t, e = /* @__PURE__ */ new WeakMap(), n = !1) {
  if (O.Function(t) && n)
    return /^function/.test(t.toString()) || /^\(\)/.test(t.toString()) ? new Function("return " + t.toString())() : new Function("return function " + t.toString())();
  if (O.Function(t))
    return t;
  if (O.Date(t)) return new Date(t.valueOf());
  if (O.Symbol(t)) return Symbol(t.description);
  if (O.Set(t)) {
    const r = /* @__PURE__ */ new Set();
    for (const s of t)
      r.add(I(s), e);
    return r;
  }
  if (O.Map(t)) {
    const r = /* @__PURE__ */ new Map();
    for (const s of t) r.set(I(s[0], e), I(s[1], e));
    return r;
  }
  if (e.has(t)) return e.get(t);
  if (O.Array(t)) {
    const r = [];
    for (const s in t) r[s] = I(t[s], e);
    return r;
  }
  if (!O.Object(t)) return t;
  const i = O.Array(t) ? [] : {};
  e.set(t, i);
  for (const r in t)
    O.Array(t[r]) && I(t[r], e), e.set(t, i), i[r] = I(t[r], e);
  const c = Object.getOwnPropertySymbols(t);
  for (const r of c)
    i[r] = I(t[r], e);
  return i;
}
function vt() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const e = Math.random() * 16 | 0;
    return (t === "x" ? e : e & 3 | 8).toString(16);
  });
}
function ee(t) {
  const e = document.createElement("style"), n = document.head || document.getElementsByTagName("head")[0];
  if (e.type = "text/css", e.styleSheet) {
    const i = function() {
      try {
        e.styleSheet.cssText = t;
      } catch {
      }
    };
    e.styleSheet.disabled ? setTimeout(i, 10) : i();
  } else {
    const i = document.createTextNode(t);
    e.appendChild(i);
  }
  n.appendChild(e);
}
function V(t, e) {
  function n(i) {
    i.props?.forEach((r) => {
      r.name === "s-if" && e.sIf(i, r), r.name === "s-for" && e.sFor(i, r), r.name === "s-html" && e.sHtml(i, r), r.name === "s-model" && e.sModel(i, r), r.name === "s-loading" && e.sLoading(i, r);
    }), i.tag === "slot" && (i.type = A.SLOT), i.children && i.children.forEach((r) => {
      n(r);
    });
  }
  return n(t), t;
}
function tt(t, e) {
  t.if = {
    value: e.value.content,
    type: e.value.type
  };
}
function B(t) {
  const e = (r = []) => {
    let s = "[";
    return r.forEach((f, a) => {
      f.type === A.ELEMENT || f.type === A.INTERPOLATION || f.type === A.SLOT ? s += n(f) + `${a === r.length - 1 ? "" : ","}` : f.type === A.TEXT && f.content.trim() && (s += n(f) + `${a === r.length - 1 ? "" : ","}`);
    }), s + "]";
  };
  function n(r) {
    let s = "";
    const f = r.props;
    if (r.type === 1 || r.type === A.SLOT) {
      let a = "", g = !1;
      if (a += `_ctx_._SUGAR._c('${r.tag}',{ `, a += '"attrs":{', a += X(f), a += '},"on":{', a += q(f), a += "}},", r.children ? a += e(r.children) : a += "[]", a += ")", r.forStatment && (g = !0, s += c(r)), r.if && !r.forStatment && (g = !0, s = `${r.if.value} ? ${s + a} : _ctx_._SUGAR._e()`), r.loading && !r.forStatment) {
        g = !0;
        const o = B(
          V(
            Y(`<div class="s-loading" s-if="${r.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            {
              sIf: tt
            }
          )
        );
        s = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${s + (r.if ? "" : a)},${o}])`;
      }
      r.htmlStatment && (g = !0, s = `_ctx_._SUGAR._c('div',{attrs:{${X(f)}},on:{${q(f)}}},[_ctx_._SUGAR._html(${r.htmlStatment.value.content})])`), g || (s += a);
    } else r.type === A.INTERPOLATION ? s += `_ctx_._SUGAR._v(_ctx_._SUGAR._s(${r.content.content}))` : r.type === A.TEXT && (s += `_ctx_._SUGAR._v(decodeURIComponent("${encodeURIComponent(r.content)}"))`);
    return s;
  }
  return n(t);
  function i(r, s, f) {
    let a = `_ctx_._SUGAR._c('${r}',{`;
    return a += '"attrs":{', a += X(s), a += '},"on":{', a += q(s), a += "}},[", f.forEach((g, o) => {
      a += B(g), o < f.length - 1 && (a += ",");
    }), a += "])", s.forEach((g) => {
      if (g.name === "s-if" && (a = `${g.value.content} ? ${a} : _ctx_._SUGAR._e()`), g.name === "s-loading" && g.value) {
        const o = B(
          V(
            Y(`<div class="s-loading" s-if="${g.value.content}">
          <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            { sIf: tt }
          )
        );
        a = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${a},${o}])`;
      }
    }), a;
  }
  function c(r) {
    const s = r.forStatment, f = i(r.tag, r.props, r.children);
    return `..._ctx_._SUGAR._loop((${s.item}${s.index ? "," + s.index : ""})=>{
      return ${f}
    },${s.exp})`;
  }
}
function X(t) {
  let e = "";
  return t = t.filter((n) => n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "s-loading" && n.name !== "s-html"), t.forEach((n, i) => {
    n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "bind" && n.name !== "slot" && n.name !== "s-html" ? e += `"${n.name}":"${n.value.content}"` : n.name === "bind" ? e += `"${n.arg.content}":${n.exp.content}` : n.name === "slot" && (e += `"slot":"${n.arg.content}"`), n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && i < t.length - 1 && (e += ",");
  }), e;
}
function q(t) {
  let e = "";
  return t = t.filter((n) => n.name === "on"), t.forEach((n, i) => {
    if (n.name === "on") {
      let c = `${n.exp.content}`;
      n.exp.isStatic && (c = `(e)=>{${n.exp.content}}`), e += `"${n.arg.content}":{"value":${c},"isStatic":${n.exp.isStatic},"modifiers":[${ne(n.modifiers)}]}`, n.name === "on" && i < t.length - 1 && (e += ",");
    }
  }), e;
}
function ne(t) {
  return R(t) ? t.map((e) => `"${e}"`) : "";
}
function re(t, e) {
  const n = e.value.content.split(" in "), i = new RegExp("(?<=\\()(.+?)(?=\\))");
  n[0] = n[0].match(i) ? n[0].match(i)[0].split(",") : n[0], t.forStatment = {
    exp: n[1],
    item: R(n[0]) ? n[0][0] : n[0],
    index: R(n[0]) ? n[0][1] : null
  };
}
function ie(t, e) {
  t.htmlStatment = {
    value: e.value
  };
}
function se(t, e) {
  t.loading = {
    value: e.value.content,
    type: e.value.type
  };
}
function oe(t, e) {
  if (e.exp.content.includes("(") && e.exp.content.includes(")")) {
    const n = e.exp.content;
    e.exp.content = e.exp.content.substring(0, n.indexOf("(")), e.exp.parameters = n.substring(n.indexOf("(") + 1, n.length - 1).split(",");
  }
}
function ce(t, e) {
  t.props.push({
    type: 7,
    name: "on",
    exp: {
      type: 4,
      content: `_ctx_.${e.value.content} = e.target.value`,
      isStatic: !0
    },
    arg: {
      type: 4,
      content: "input"
    },
    modifiers: []
  }), t.props.push({
    type: 7,
    name: "bind",
    exp: {
      type: 4,
      content: `_ctx_.${e.value.content}`
    },
    arg: {
      type: 4,
      content: "value"
    },
    modifiers: []
  });
}
function ae(t) {
  const e = Y(t);
  return V(e, {
    sIf: tt,
    sFor: re,
    sHtml: ie,
    sLoading: se,
    transformEvent: oe,
    sModel: ce
  }), {
    root: e,
    code: B(e)
  };
}
function Tt(t) {
  function e(i = "") {
    const { code: c, root: r } = ae(i);
    return {
      code: n(c),
      root: r
    };
  }
  function n(i = "") {
    return new Function(`    const _ctx_ = this;
    const proxy = new Proxy({}, {
      get(target, prop, receiver) {
        if (prop in ctx) {
          return ctx[prop];
        }
        throw new ReferenceError(\`Missing variable \${String(prop)} in template\`);
      }
    });
    return ${i.toString()};
  `);
  }
  return e(t);
}
function K(t, e) {
  return !!e[t.tag] || t.tag === "component";
}
const It = {};
function fe(t, e) {
  It[e] = t;
}
function ht(t) {
  return It[t];
}
const et = [];
let nt = !1;
function le() {
  nt = !1;
  const t = et.slice(0);
  et.length = 0;
  for (let e = 0; e < t.length; e++)
    t[e]();
}
async function Rt(t) {
  let e;
  if (et.push(() => {
    t ? t() : e && e();
  }), nt || (nt = !0, Promise.resolve().then(le)), !t)
    return await new Promise((n, i) => {
      e = n;
    });
}
const Q = /* @__PURE__ */ new Set();
let Z = !1;
function ue(t) {
  Q.add(t), Z || (Z = !0, Promise.resolve().then(() => {
    for (const e of Q) e();
    Q.clear(), Z = !1;
  }));
}
const rt = /* @__PURE__ */ new WeakMap();
let z = null;
function at(t) {
  const e = () => {
    z = e, t(), z = null;
  };
  return e(), e;
}
function xt(t, e) {
  if (!z) return;
  let n = rt.get(t);
  n || (n = /* @__PURE__ */ new Map(), rt.set(t, n));
  let i = n.get(e);
  i || (i = /* @__PURE__ */ new Set(), n.set(e, i)), i.add(z);
}
function Pt(t, e) {
  const n = rt.get(t);
  if (!n) return;
  const i = n.get(e);
  if (i)
    for (const c of i)
      ue(c);
}
function ge(t, e) {
  let n;
  typeof t == "function" ? n = t : kt(t) ? n = () => t.value : n = () => it(t);
  let i;
  function c() {
    const r = n();
    e(r, i), i = r;
  }
  at(c);
}
function kt(t) {
  return t && typeof t == "object" && t.__isRef;
}
function it(t, e = /* @__PURE__ */ new Set()) {
  if (!(typeof t != "object" || t === null || e.has(t))) {
    if (e.add(t), kt(t))
      it(t.value, e);
    else
      for (const n in t)
        it(t[n], e);
    return t;
  }
}
function me(t) {
  let e = t;
  return {
    get value() {
      return xt(this, "value"), e;
    },
    set value(n) {
      n !== e && (e = n, Pt(this, "value"));
    },
    __isRef: !0
  };
}
function ft(t) {
  return new Proxy(t, {
    get(e, n, i) {
      const c = Reflect.get(e, n, i);
      return xt(e, n), typeof c == "object" && c !== null ? ft(c) : c;
    },
    set(e, n, i, c) {
      const r = e[n], s = Reflect.set(e, n, i, c);
      return r !== i && Pt(e, n), s;
    }
  });
}
function de(t) {
  return t || {};
}
function pt(t, e, n) {
  const {
    data: { attrs: i, on: c },
    children: r
  } = t, s = I(e), f = ft({}), a = r;
  if (Object.keys(i).forEach((o) => {
    o !== "ref" && (f[o] = i[o]);
  }), Object.keys(c).forEach((o) => {
    c[o].parameters ? f[o] = function() {
      c[o].value(...c[o].parameters);
    } : f[o] = c[o].value;
  }), t.key && ht(t.key))
    return ht(t.key);
  const g = he({
    ...s,
    props: f,
    slot: a,
    parent: n
  });
  return g.mount(), t.key && fe(g, t.key), g;
}
function he(t) {
  const e = vt();
  Et(e);
  const n = t.bulk(t.props), { mounted: i, update: c } = pe(), r = {}, s = {
    render: t.render,
    _vnode: null,
    data: n,
    $el: null,
    appId: e,
    components: t.components ? t.components : [],
    sugar: {},
    slot: t.slot,
    props: t.props,
    headTag: t.headTag || "div",
    use: o,
    parent: t.parent.parent ? t.parent.parent : t.parent
  };
  R(s.components) && (s.components = s.components.reduce((l, u) => (l[u.name] = u, l), {})), Object.values(s.parent.components).forEach((l) => {
    o(l);
  }), Object.values(n).forEach((l) => {
    l.headTag && l.render && l.name && l.bulk && o(l);
  });
  function f() {
    i(s, n), k[e]?.forEach((l) => {
      l.fun(), l.used = !0;
    }), at(() => {
      c(s);
    });
  }
  function a() {
    c(s);
  }
  function g(l) {
    s.slot = l, c(s);
  }
  function o(l) {
    R(l) || (l = [l]), l.forEach((u) => {
      u.name ? (s.components[u.name] = u, s.components[u.name].components = s.components) : u.fun && (r[u.fun] = u.bulk);
    });
  }
  return {
    vm: s,
    mount: f,
    ...n,
    updateSlot: g,
    forceUpdate: a,
    use: o,
    $: r
  };
}
function pe() {
  let t = null;
  function e(s, f) {
    s.$el = document.createElement(s.headTag), s._vnode = s.$el, t = s.render, Mt(s, f), s.forceUpdate = function() {
      n(s);
    };
  }
  function n(s) {
    const f = st(s), a = t.call(st(s));
    s.slot.length && i(a, s.slot), jt(f, a), f._vnode = a;
  }
  function i(s, f) {
    for (let a = 0; a < s.children.length; a++) {
      const g = s.children[a];
      if (g.tag === "slot" && c(f) && g.data.attrs?.name === "default")
        s.children.splice(0, 1, ...f);
      else if (g.tag === "slot" && g.data.attrs?.name) {
        const o = f.find((l) => l.data?.attrs.slot === g.data.attrs.name);
        r(g, o, s.children);
      } else g.children?.length && i(g, f);
    }
  }
  function c(s) {
    return !s.find((f) => !!f.data?.attrs.slot);
  }
  function r(s, f, a) {
    if (!f) {
      a.splice(a.indexOf(s), 1, []);
      return;
    }
    a.splice(a.indexOf(s), 1, ...f.children);
  }
  return {
    update: n,
    mounted: e
  };
}
function ye(t) {
  const { code: e, root: n } = Tt(t.render);
  return {
    ...t,
    render: e,
    headTag: n.tag
  };
}
function jt(t, e) {
  let n = t._vnode;
  n.elm || (n = Ee(n)), x(n, e) ? r(e, n) : n.elm?.parentNode && e ? (P.insert(
    i(e),
    P.parentNode(n.elm),
    n.elm
  ), P.remove(n.elm)) : r(e, n);
  function i(o) {
    let l;
    if (o.tag) {
      if (typeof o.tag == "string" && !K(o, t.components)) {
        if (o.tag === "component" && o.data.attrs.is) {
          const d = pt(o, o.data.attrs.is, t);
          o.elm = d.vm.$el, o._sugar = d, l = o.elm, o.data.attrs.ref && o.data.attrs.ref in t && (t[o.data.attrs.ref] = d);
        } else o.tag === "svg" || o.tag === "path" ? l = document.createElementNS("http://www.w3.org/2000/svg", o.tag) : l = document.createElement(o.tag);
        const { data: u = {} } = o || {}, { attrs: h = {}, on: m = {} } = u;
        for (const d in h)
          if (Object.hasOwnProperty.call(h, d)) {
            const y = h[d];
            l.setAttribute(d, y), d === "ref" && y in t && (t[y] = l);
          }
        const p = l._vei || (l._vei = {});
        for (const d in m)
          if (Object.hasOwnProperty.call(m, d) && m[d].value) {
            const y = (_) => {
              m[d].value(_), m[d].modifiers.includes("stop") && _.stopPropagation(), m[d].modifiers.includes("prevent") && _.preventDefault();
            };
            l.addEventListener(d, y), p[d] = y;
          }
        if (o.children)
          for (let d = 0; d < o.children.length; d++) {
            const y = i(o.children[d]);
            y && l.append(y);
          }
      } else if (K(o, t.components)) {
        const u = pt(o, t.components[c(o, t)], t);
        o.elm = u.vm.$el, o._sugar = u, l = o.elm, o.data.attrs.ref && o.data.attrs.ref in t && (t[o.data.attrs.ref] = u);
      }
    } else o.text !== void 0 ? l = document.createTextNode(o.text) : o.elm !== void 0 && (l = o.elm);
    return o.elm = l, l;
  }
  function c(o, l) {
    return o.tag === "component" ? (l.use(o.data.attrs.is), o.data.attrs.is.name) : o.tag;
  }
  function r(o, l) {
    if (K(o, t.components)) {
      if (l._sugar)
        Se(o, l), Lt(o, t);
      else {
        const u = i(o);
        P.insert(u, P.parentNode(l.elm), l.elm), l.elm.remove(), l.elm = u;
      }
      return;
    }
    if (o.elm = l.elm, o.text !== void 0)
      l.text !== o.text && (l.elm.nodeValue = o.text);
    else if (o.tag) {
      if (s(o, l, t), l.children?.length)
        a(l.elm, l.children, o.children);
      else if (o.children.length > 0) {
        l.elm.innerHTML = "";
        for (let u = 0; u < o.children.length; u++) {
          const h = i(o.children[u]);
          h && l.elm.appendChild(h);
        }
      }
    }
  }
  function s(o, l, u) {
    const h = o.data.attrs, m = o.data.on, p = l.data.attrs, d = o.elm;
    f(d, p, h, u), _e(d, m);
  }
  function f(o, l, u, h) {
    l && Object.keys(l).forEach((m) => {
      u[m] !== l[m] && o.removeAttribute(m);
    }), Object.keys(u).forEach((m) => {
      m === "value" && (o.value = u[m]), (!l || u[m] !== l[m]) && o.setAttribute(m, u[m]), m === "ref" && u[m] in h && (h[u[m]] = o);
    });
  }
  function a(o, l, u) {
    l = yt(l), u = yt(u);
    let h = 0, m = l.length - 1, p = 0, d = u.length - 1, y = l[h], _ = l[m], S = u[p], T = u[d], w, L, M, D;
    for (; h <= m && p <= d; )
      !y || !l[h] ? y = l[++h] : !_ || !l[m] ? _ = l[--m] : !S || !u[p] ? S = u[++p] : !T || !u[d] ? T = u[--d] : x(S, y) ? (r(S, y), y = l[++h], S = u[++p]) : x(S, _) ? (r(S, _), o.insertBefore(_.elm, y.elm), _ = l[--m], S = u[++p]) : x(T, y) ? (r(T, y), o.insertBefore(y.elm, _.elm.nextSibling), y = l[++h], T = u[--d]) : x(T, _) ? (r(T, _), _ = l[--m], T = u[--d]) : (W(w) && (w = g(l, h, m)), L = dt(S.key) ? w[S.key] : null, W(L) ? (o.insertBefore(i(S), y.elm), S = u[++p]) : (M = l[L], x(M, S) ? (r(S, M), l[L] = void 0, o.insertBefore(M.elm, y.elm)) : o.insertBefore(i(S), y.elm), S = u[++p]));
    if (h > m)
      for (D = W(u[d + 1]) ? null : u[d + 1].elm; p <= d; p++)
        D ? o.insertBefore(i(u[p]), D) : o.append(i(u[p]));
    if (p > d)
      for (let U = h; U <= m; U++)
        l[U]?.elm && o.removeChild(l[U].elm);
  }
  function g(o, l, u) {
    let h, m;
    const p = {};
    for (h = l; h <= u; ++h)
      m = o[h].key, dt(m) && (p[m] = h);
    return p;
  }
}
function Se(t, e) {
  Object.keys(e._sugar.vm.props).forEach((n) => {
    const { attrs: i, on: c } = t.data;
    Object.keys(i).includes(n) ? e._sugar.vm.props[n] = t.data.attrs[n] : Object.keys(c).includes(n) && (t.data.on[n].parameters ? e._sugar.vm.props[n] = function() {
      t.data.on[n].value(...t.data.on[n].parameters);
    } : e._sugar.vm.props[n] = t.data.on[n].value);
  }), e._sugar.updateSlot(t.children), t.elm = e.elm, t._sugar = e._sugar;
}
function Ee(t) {
  return new be(t.tagName.toLowerCase(), {}, [], t);
}
function x(t, e) {
  return t.key === e.key && t.tag === e.tag;
}
function _e(t, e) {
  const n = t._vei || (t._vei = {});
  Object.keys(n).forEach((i) => {
    t.removeEventListener(i, n[i]);
  }), Object.keys(e).forEach((i) => {
    n[i] = (c) => {
      e[i].modifiers.includes("stop") && c.stopPropagation(), e[i].modifiers.includes("prevent") && c.preventDefault(), e[i].value(c);
    }, t.addEventListener(i, n[i]);
  });
}
function yt(t) {
  return t.filter((e) => e.tag || e.text === "" || e.text || e.elm);
}
function Lt(t, e) {
  const n = t.data;
  if (n) {
    const i = n.attrs;
    i.ref && e[i.ref] in e && (e[i.ref] = t.elm);
  }
  t.children && t.children.forEach((i) => {
    Lt(i, e);
  });
}
let be = class {
  tag;
  data;
  elm;
  context;
  text;
  key;
  _sugar;
  constructor(e, n, i, c) {
    this.tag = e, this.data = n, this.children = i, this.key = n.attrs?.key, this.elm = c, this.context = void 0, this.text = void 0;
  }
};
function Oe() {
  let t = null;
  function e(i, c) {
    const r = new XMLSerializer();
    if (i.render)
      t = i.render;
    else {
      const s = i.render ? i.render : te(r.serializeToString(i.$el)), { code: f } = Tt(s);
      t = f;
    }
    Mt(i, c), at(() => {
      n(i);
    });
  }
  function n(i) {
    const c = st(i), r = t?.call(c);
    jt(c, r), c._vnode = r;
  }
  return {
    update: n,
    mounted: e
  };
}
function st(t) {
  return new Proxy(t, {
    get(e, n, i) {
      const c = Reflect.get(e, n, i);
      return St(c) ? c.value : c;
    },
    set(e, n, i, c) {
      const r = Reflect.get(e, n, c);
      return St(r) ? r.value = i : Reflect.set(e, n, i), !0;
    }
  });
}
function St(t) {
  return !!t?.__isRef;
}
function Mt(t, e) {
  Object.keys(e).forEach((a) => {
    t[a] = e[a];
  });
  function n(a = "div", g = {}, o = []) {
    return Ut(a, g, o);
  }
  function i(a) {
    const g = new Nt();
    return g.text = a, g;
  }
  function c(a) {
    return String(a);
  }
  function r() {
    return {
      tag: "div",
      data: {
        attrs: {
          class: "s-block"
        },
        on: {}
      },
      children: [],
      elm: {
        _vei: {}
      }
    };
  }
  function s(a) {
    return Ae(a);
  }
  function f(a, g) {
    const o = [];
    return g.forEach((l, u) => {
      o.push({
        ...a(l, u)
      });
    }), o;
  }
  t._SUGAR = {
    _c: n,
    _v: i,
    _s: c,
    _e: r,
    _loop: f,
    _html: s
  };
}
function Ut(t = "div", e = {}, n = []) {
  return ((c = "div", r = {}, s = []) => {
    const f = [];
    return s && s.length > 0 && s.forEach((a) => {
      f.push(a);
    }), new Nt(c, r, f);
  })(t, e, n);
}
class Nt {
  tag;
  data;
  elm;
  context;
  text;
  key;
  sugar;
  constructor(e, n, i) {
    this.tag = e, this.data = n, this.children = i, this.elm = void 0, this.context = void 0, this.text = void 0, this.key = n?.attrs?.key;
  }
}
function Ae(t) {
  function e(i) {
    const c = {
      attrs: {},
      on: {}
    };
    Array.from(i.attributes).forEach((s) => {
      c.attrs[s.name] = s.value;
    });
    const r = Ut(i.tagName, c, []);
    return Array.from(i.childNodes).forEach((s) => {
      s.nodeType === 1 ? r.children.push(e(s)) : s.nodeType === 3 && r.children.push({
        tag: "",
        content: s.textContent,
        children: [],
        elm: void 0,
        text: s.textContent,
        key: void 0,
        data: void 0
      });
    }), r;
  }
  const n = document.createElement("div");
  return n.innerHTML = t, e(n);
}
function $e() {
  ee(`
      .s-block{
        display:none;
      }
  
      .s-loading{
        position: absolute;
        background: rgba(255,255,255,0.8);
        z-index: 99999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .s-loading svg{
        animation: sLoading 1s linear infinite;
      }
  
      @keyframes sLoading {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
  
  `);
}
function ve(t) {
  const e = vt();
  Et(e);
  const n = t.bulk(t.props), i = {}, { mounted: c } = Oe(), r = {
    render: t.render,
    _vnode: null,
    data: n,
    $el: null,
    appId: e,
    components: t.components || [],
    sugar: {},
    slot: t.slot,
    forceUpdate: () => {
    },
    use: f
  };
  R(r.components) && (r.components = r.components.reduce((a, g) => (a[g.name] = g, a), {}));
  function s(a) {
    $e(), r._vnode = r.$el = typeof a == "string" ? document.querySelector(`${a}`) : a, c(r, n), Rt(() => {
      k[e]?.forEach((g) => {
        g.fun(), g.used = !0;
      });
    });
  }
  function f(a) {
    R(a) || (a = [a]), a.forEach((g) => {
      g.name ? (r.components[g.name] = g, r.components[g.name].components = r.components) : g.fun && (i[g.fun] = g.bulk);
    }), r.$el && r.forceUpdate();
  }
  return {
    vm: r,
    mount: s,
    ...n,
    use: f,
    $: i
  };
}
typeof window < "u" && (function(t) {
  t.SUGAR = {
    onMounted: Ft,
    createApp: ve,
    nextTick: Rt,
    ref: me,
    Component: ye,
    reactive: ft,
    watch: ge,
    defineProps: de
  };
})(window);
export {
  ye as Component,
  ve as createApp,
  de as defineProps,
  Rt as nextTick,
  Ft as onMounted,
  ft as reactive,
  me as ref,
  Tt as sugarCompiler,
  ge as watch
};
//# sourceMappingURL=sugar.es.js.map
