let x = {}, M = "";
function Ut(t) {
  x[M] || (x[M] = []), x[M].push({
    used: !1,
    fun: t
  });
}
function yt(t) {
  M = t;
}
const Nt = Array.isArray, Ft = Object.assign;
function Bt(t) {
  return /^[A-Za-z_$][\w$]*$/.test(t);
}
function wt(t) {
  if (Bt(t))
    return !0;
  const e = ["(", ")", "=>", "+", "-", "*", "/", ".", "[", "]"];
  for (const n of e)
    if (t.includes(n))
      return !1;
  return !0;
}
const st = [];
function ft(t) {
  st.push(t);
}
function Gt() {
  st.pop();
}
function St(t, e) {
  const n = ot(e), i = [];
  for (; !Dt(t, e); ) {
    const o = t.source;
    let f;
    if (_(o, t.options.delimiters[0]))
      f = Xt(t);
    else if (o[0] === "<" && o.length !== 1)
      if (o[1] === "/")
        if (o[2] === ">") {
          S(t, 3);
          continue;
        } else if (/[a-z]/i.test(o[2])) {
          Z(
            t,
            1
            /* End */
          );
          continue;
        } else
          f = gt(t);
      else /[a-z]/i.test(o[1]) ? f = Wt(t, e) : o[1] === "!" && (f = gt(t));
    if (f || (f = qt(t)), Nt(f))
      for (let l = 0; l < f.length; l++)
        ut(i, f[l]);
    else
      ut(i, f);
  }
  let c = !1;
  const r = t.options.whitespace !== "preserve";
  for (let o = 0; o < i.length; o++) {
    const f = i[o];
    if (f.type === 2)
      if (t.inPre)
        f.content = f.content.replace(/\r\n/g, `
`);
      else if (/[^\t\r\n\f ]/.test(f.content))
        r && (f.content = f.content.replace(/[\t\r\n\f ]+/g, " "));
      else {
        const l = i[o - 1], s = i[o + 1];
        !l || !s || r && (l.type === 3 && s.type === 3 || l.type === 3 && s.type === 1 || l.type === 1 && s.type === 3 || l.type === 1 && s.type === 1 && /[\r\n]/.test(f.content)) ? (c = !0, i[o] = null) : f.content = " ";
      }
    else f.type === 3 && !t.options.comments && (c = !0, i[o] = null);
  }
  if (t.inPre && n && t.options.isPreTag(n.tag)) {
    const o = i[0];
    o && o.type === 2 && (o.content = o.content.replace(/^\r?\n/, ""));
  }
  return c ? i.filter(Boolean) : i;
}
function zt(t, e) {
  const n = [], i = /* @__PURE__ */ new Set(), c = t.source.slice(0, t.source.indexOf(">")).match(/s-for\s*=\s*["']\s*\(([^)]+)\)\s+in\s+[^"']+["']/);
  if (c) {
    const r = c[1].split(",").map((o) => o.trim());
    ft(r);
  } else e === 0 && ft([]);
  for (; t.source.length > 0 && !_(t.source, ">") && !_(t.source, "/>"); ) {
    if (_(t.source, "/")) {
      S(t, 1), P(t);
      continue;
    }
    const r = Ct(t, i);
    if (["s-if", "s-html"].includes(r.name) && (r.value.content = B(r.value.content)), r.name === "s-for") {
      const o = r.value.content.split(" in ");
      r.value.content = o[0] + " in " + B(o[1]);
    }
    r.type === 6 && r.value && r.name === "class" && (r.value.content = r.value.content.replace(/\s+/g, " ").trim()), e === 0 && n.push(r), P(t);
  }
  return n;
}
function Ct(t, e) {
  const n = O(t), c = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(t.source)[0];
  e.add(c), S(t, c.length);
  let r;
  /^[\t\r\n\f ]*=/.test(t.source) && (P(t), S(t, 1), P(t), r = Ht(t));
  const o = A(t, n);
  if (!t.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(c)) {
    const f = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(c), l = _(c, "."), s = f[1] || (l || _(c, ":") ? "bind" : _(c, "@") || _(c, "s-on:") ? "on" : "slot");
    let a;
    if (f[2]) {
      const g = s === "slot", m = c.lastIndexOf(f[2], c.length - (f[3]?.length || 0)), p = A(
        t,
        at(t, n, m),
        at(
          t,
          n,
          m + f[2].length + (g && f[3] || "").length
        )
      );
      let d = f[2];
      d.startsWith("[") ? d.endsWith("]") ? d = d.slice(1, d.length - 1) : d = d.slice(1) : g && (d += f[3] || ""), a = {
        type: 4,
        content: d,
        loc: p
      };
    }
    if (r?.isQuoted) {
      const g = r.loc;
      g.start.offset++, g.start.column++, g.end = _t(g.start, r.content), g.source = g.source.slice(1, -1);
    }
    const u = f[3] ? f[3].slice(1).split(".") : [];
    return l && u.push("prop"), {
      type: 7,
      name: s,
      exp: r && {
        type: 4,
        content: B(r.content),
        loc: r.loc,
        isStatic: !wt(r.content)
      },
      arg: a,
      modifiers: u,
      loc: o
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
    loc: o
  };
}
function at(t, e, n) {
  return _t(
    e,
    t.originalSource.slice(e.offset, n),
    n
  );
}
function Ht(t) {
  const e = O(t);
  let n;
  const i = t.source[0], c = i === '"' || i === "'";
  if (c) {
    S(t, 1);
    const r = t.source.indexOf(i);
    r === -1 ? n = U(t, t.source.length) : (n = U(t, r), S(t, 1));
  } else {
    const r = /^[^\t\r\n\f >]+/.exec(t.source);
    if (!r)
      return;
    n = U(t, r[0].length);
  }
  return {
    content: n,
    isQuoted: c,
    loc: A(t, e)
  };
}
function ut(t, e) {
  if (e.type === 2) {
    const n = ot(t);
    if (n && n.type === 2 && n.loc.end.offset === e.loc.start.offset) {
      n.content += e.content, n.loc.end = e.loc.end, n.loc.source += e.loc.source;
      return;
    }
  }
  t.push(e);
}
function Wt(t, e) {
  ot(e);
  const n = Z(
    t,
    0
    /* Start */
  );
  if (n.isSelfClosing || t.options.isVoidTag(n.tag))
    return n;
  e.push(n);
  const i = St(t, e);
  return e.pop(), n.children = i, bt(t.source, n.tag) && Z(
    t,
    1
    /* End */
  ), n.loc = A(t, n.loc.start), n;
}
function Z(t, e, n) {
  const i = O(t), c = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(t.source), r = c[1];
  S(t, c[0].length), P(t);
  const o = zt(t, e);
  let f = !1;
  if (t.source.length !== 0 && (f = _(t.source, "/>"), S(t, f ? 2 : 1)), e === 1) {
    Gt();
    return;
  }
  return {
    type: 1,
    tag: r,
    tagType: 0,
    children: [],
    props: o,
    isSelfClosing: f,
    loc: A(t, i)
  };
}
var Et = /* @__PURE__ */ ((t) => (t[t.HTML = 0] = "HTML", t))(Et || {});
function gt(t) {
  const e = O(t), n = t.source[1] === "?" ? 1 : 2;
  let i;
  const c = t.source.indexOf("-->") + 2;
  return c === -1 ? (i = t.source.slice(n), S(t, t.source.length)) : (i = t.source.slice(n, c), S(t, c + 1)), {
    type: 3,
    content: i,
    loc: A(t, e)
  };
}
function Dt(t, e) {
  const n = t.source;
  if (_(n, "</")) {
    for (let i = e.length - 1; i >= 0; --i)
      if (bt(n, e[i].tag))
        return !0;
  }
  return !n;
}
function Xt(t) {
  const [e, n] = t.options.delimiters, i = t.source.indexOf(n, e.length), c = O(t);
  S(t, e.length);
  const r = O(t), o = O(t), f = i - e.length, l = t.source.slice(0, f), s = Kt(t, f), a = s.trim(), u = s.indexOf(a);
  u > 0 && F(r, l, u);
  const g = f - (s.length - a.length - u);
  return F(o, l, g), S(t, n.length), {
    type: 5,
    content: {
      type: 4,
      content: B(a),
      loc: A(t, r, o)
    },
    loc: A(t, c)
  };
}
function qt(t) {
  const e = ["<", t.options.delimiters[0]];
  let n = t.source.length;
  for (let r = 0; r < e.length; r++) {
    const o = t.source.indexOf(e[r], 1);
    o !== -1 && n > o && (n = o);
  }
  const i = O(t);
  return {
    type: 2,
    content: U(t, n),
    loc: A(t, i)
  };
}
function U(t, e) {
  const n = t.source.slice(0, e);
  return S(t, e), n;
}
function A(t, e, n) {
  return n = n || O(t), {
    start: e,
    end: n,
    source: t.originalSource.slice(e.offset, n.offset)
  };
}
function Kt(t, e) {
  const n = t.source.slice(0, e);
  return S(t, e), n;
}
function S(t, e) {
  const { source: n } = t;
  F(t, n, e), t.source = n.slice(e);
}
function F(t, e, n = e.length) {
  let i = 0, c = -1;
  for (let r = 0; r < n; r++)
    e.charCodeAt(r) === 10 && (i++, c = r);
  return t.offset += n, t.line += i, t.column = c === -1 ? t.column + n : n - c, t;
}
function _t(t, e, n = e.length) {
  return F(Ft({}, t), e, n);
}
function P(t) {
  const e = /^[\t\r\n\f ]+/.exec(t.source);
  e && S(t, e[0].length);
}
function _(t, e) {
  return t.startsWith(e);
}
function bt(t, e) {
  return _(t, "</") && t.slice(2, 2 + e.length).toLowerCase() === e.toLowerCase() && /[\t\r\n\f />]/.test(t[2 + e.length] || ">");
}
function ot(t) {
  return t[t.length - 1];
}
function O(t) {
  const { column: e, line: n, offset: i } = t;
  return {
    column: e,
    line: n,
    offset: i
  };
}
var v = /* @__PURE__ */ ((t) => (t[t.ROOT = 0] = "ROOT", t[t.ELEMENT = 1] = "ELEMENT", t[t.TEXT = 2] = "TEXT", t[t.COMMENT = 3] = "COMMENT", t[t.SIMPLE_EXPRESSION = 4] = "SIMPLE_EXPRESSION", t[t.INTERPOLATION = 5] = "INTERPOLATION", t[t.ATTRIBUTE = 6] = "ATTRIBUTE", t[t.DIRECTIVE = 7] = "DIRECTIVE", t[t.COMPOUND_EXPRESSION = 8] = "COMPOUND_EXPRESSION", t[t.COMPONENT = 9] = "COMPONENT", t[t.SLOT = 10] = "SLOT", t))(v || {});
const Qt = /* @__PURE__ */ new Set([
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
function B(t) {
  return t.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (e, n, i, c) => {
    const r = c.slice(0, i), o = /'[^']*$/.test(r) && /[^']*'/.test(c.slice(i)), f = /"[^"]*$/.test(r) && /[^"]*"/.test(c.slice(i)), l = /`[^`]*$/.test(r) && /[^`]*`/.test(c.slice(i));
    if (o || f || l) return e;
    const s = c[i - 1];
    return s === "." || s === ":" || Zt(n) || Qt.has(n) ? e : `_ctx_.${n}`;
  });
}
function vt(t) {
  const e = [];
  for (const n of t)
    Array.isArray(n) ? e.push(...vt(n)) : e.push(n);
  return e;
}
function Zt(t) {
  return vt(st).includes(t);
}
const H = (t) => !1;
function J(t) {
  const e = Jt(t);
  return St(e, [])[0];
}
function Jt(t) {
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
      getNamespace: (e, n) => Et.HTML
    }
  };
}
const R = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  parentNode: (t) => t.parentNode
}, w = (t) => t instanceof Array;
function dt(t) {
  return t != null;
}
function W(t) {
  return t == null;
}
function Yt(t) {
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
const b = {
  Array: Array.isArray,
  Date: (t) => t instanceof Date,
  Set: (t) => Object.prototype.toString.call(t) === "[object Set]",
  Map: (t) => Object.prototype.toString.call(t) === "[object Map]",
  Object: (t) => Object.prototype.toString.call(t) === "[object Object]",
  Symbol: (t) => Object.prototype.toString.call(t) === "[object Symbol]",
  Function: (t) => Object.prototype.toString.call(t) === "[object Function]"
};
function T(t, e = /* @__PURE__ */ new WeakMap(), n = !1) {
  if (b.Function(t) && n)
    return /^function/.test(t.toString()) || /^\(\)/.test(t.toString()) ? new Function("return " + t.toString())() : new Function("return function " + t.toString())();
  if (b.Function(t))
    return t;
  if (b.Date(t)) return new Date(t.valueOf());
  if (b.Symbol(t)) return Symbol(t.description);
  if (b.Set(t)) {
    const r = /* @__PURE__ */ new Set();
    for (const o of t)
      r.add(T(o), e);
    return r;
  }
  if (b.Map(t)) {
    const r = /* @__PURE__ */ new Map();
    for (const o of t) r.set(T(o[0], e), T(o[1], e));
    return r;
  }
  if (e.has(t)) return e.get(t);
  if (b.Array(t)) {
    const r = [];
    for (const o in t) r[o] = T(t[o], e);
    return r;
  }
  if (!b.Object(t)) return t;
  const i = b.Array(t) ? [] : {};
  e.set(t, i);
  for (const r in t)
    b.Array(t[r]) && T(t[r], e), e.set(t, i), i[r] = T(t[r], e);
  const c = Object.getOwnPropertySymbols(t);
  for (const r of c)
    i[r] = T(t[r], e);
  return i;
}
function Ot() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const e = Math.random() * 16 | 0;
    return (t === "x" ? e : e & 3 | 8).toString(16);
  });
}
function Vt(t) {
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
function Y(t, e) {
  function n(i) {
    i.props?.forEach((r) => {
      r.name === "s-if" && e.sIf(i, r), r.name === "s-for" && e.sFor(i, r), r.name === "s-html" && e.sHtml(i, r), r.name === "s-model" && e.sModel(i, r), r.name === "s-loading" && e.sLoading(i, r);
    }), i.tag === "slot" && (i.type = v.SLOT), i.children && i.children.forEach((r) => {
      n(r);
    });
  }
  return n(t), t;
}
function V(t, e) {
  t.if = {
    value: e.value.content,
    type: e.value.type
  };
}
function N(t) {
  const e = (r = []) => {
    let o = "[";
    return r.forEach((f, l) => {
      f.type === v.ELEMENT || f.type === v.INTERPOLATION || f.type === v.SLOT ? o += n(f) + `${l === r.length - 1 ? "" : ","}` : f.type === v.TEXT && f.content.trim() && (o += n(f) + `${l === r.length - 1 ? "" : ","}`);
    }), o + "]";
  };
  function n(r) {
    let o = "";
    const f = r.props;
    if (r.type === 1 || r.type === v.SLOT) {
      let l = "", s = !1;
      if (l += `_ctx_._SUGAR._c('${r.tag}',{ `, l += '"attrs":{', l += D(f), l += '},"on":{', l += X(f), l += "}},", r.children ? l += e(r.children) : l += "[]", l += ")", r.forStatment && (s = !0, o += c(r)), r.if && !r.forStatment && (s = !0, o = `${r.if.value} ? ${o + l} : _ctx_._SUGAR._e()`), r.loading && !r.forStatment) {
        s = !0;
        const a = N(
          Y(
            J(`<div class="s-loading" s-if="${r.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            {
              sIf: V
            }
          )
        );
        o = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${o + (r.if ? "" : l)},${a}])`;
      }
      r.htmlStatment && (s = !0, o = `_ctx_._SUGAR._c('div',{attrs:{${D(f)}},on:{${X(f)}}},[_ctx_._SUGAR._html(${r.htmlStatment.value.content})])`), s || (o += l);
    } else r.type === v.INTERPOLATION ? o += `_ctx_._SUGAR._v(_ctx_._SUGAR._s(${r.content.content}))` : r.type === v.TEXT && (o += `_ctx_._SUGAR._v(decodeURIComponent("${encodeURIComponent(r.content)}"))`);
    return o;
  }
  return n(t);
  function i(r, o, f) {
    let l = `_ctx_._SUGAR._c('${r}',{`;
    return l += '"attrs":{', l += D(o), l += '},"on":{', l += X(o), l += "}},[", f.forEach((s, a) => {
      l += N(s), a < f.length - 1 && (l += ",");
    }), l += "])", o.forEach((s) => {
      if (s.name === "s-if" && (l = `${s.value.content} ? ${l} : _ctx_._SUGAR._e()`), s.name === "s-loading" && s.value) {
        const a = N(
          Y(
            J(`<div class="s-loading" s-if="${s.value.content}">
          <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            { sIf: V }
          )
        );
        l = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${l},${a}])`;
      }
    }), l;
  }
  function c(r) {
    const o = r.forStatment, f = i(r.tag, r.props, r.children);
    return `..._ctx_._SUGAR._loop((${o.item}${o.index ? "," + o.index : ""})=>{
      return ${f}
    },${o.exp})`;
  }
}
function D(t) {
  let e = "";
  return t = t.filter((n) => n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "s-loading" && n.name !== "s-html"), t.forEach((n, i) => {
    n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "bind" && n.name !== "slot" && n.name !== "s-html" ? e += `"${n.name}":"${n.value.content}"` : n.name === "bind" ? e += `"${n.arg.content}":${n.exp.content}` : n.name === "slot" && (e += `"slot":"${n.arg.content}"`), n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && i < t.length - 1 && (e += ",");
  }), e;
}
function X(t) {
  let e = "";
  return t = t.filter((n) => n.name === "on"), t.forEach((n, i) => {
    if (n.name === "on") {
      let c = `${n.exp.content}`;
      n.exp.isStatic && (c = `(e)=>{${n.exp.content}}`), e += `"${n.arg.content}":{"value":${c},"isStatic":${n.exp.isStatic},"modifiers":[${te(n.modifiers)}]}`, n.name === "on" && i < t.length - 1 && (e += ",");
    }
  }), e;
}
function te(t) {
  return w(t) ? t.map((e) => `"${e}"`) : "";
}
function ee(t, e) {
  const n = e.value.content.split(" in "), i = new RegExp("(?<=\\()(.+?)(?=\\))");
  n[0] = n[0].match(i) ? n[0].match(i)[0].split(",") : n[0], t.forStatment = {
    exp: n[1],
    item: w(n[0]) ? n[0][0] : n[0],
    index: w(n[0]) ? n[0][1] : null
  };
}
function ne(t, e) {
  t.htmlStatment = {
    value: e.value
  };
}
function re(t, e) {
  t.loading = {
    value: e.value.content,
    type: e.value.type
  };
}
function ie(t, e) {
  if (e.exp.content.includes("(") && e.exp.content.includes(")")) {
    const n = e.exp.content;
    e.exp.content = e.exp.content.substring(0, n.indexOf("(")), e.exp.parameters = n.substring(n.indexOf("(") + 1, n.length - 1).split(",");
  }
}
function se(t, e) {
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
function oe(t) {
  const e = J(t);
  return Y(e, {
    sIf: V,
    sFor: ee,
    sHtml: ne,
    sLoading: re,
    transformEvent: ie,
    sModel: se
  }), {
    root: e,
    code: N(e)
  };
}
function At(t) {
  function e(i = "") {
    const { code: c, root: r } = oe(i);
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
function q(t, e) {
  return !!e[t.tag];
}
const $t = {};
function ce(t, e) {
  $t[e] = t;
}
function mt(t) {
  return $t[t];
}
const tt = [];
let et = !1;
function le() {
  et = !1;
  const t = tt.slice(0);
  tt.length = 0;
  for (let e = 0; e < t.length; e++)
    t[e]();
}
async function Tt(t) {
  let e;
  if (tt.push(() => {
    t ? t() : e && e();
  }), et || (et = !0, Promise.resolve().then(le)), !t)
    return await new Promise((n, i) => {
      e = n;
    });
}
const K = /* @__PURE__ */ new Set();
let Q = !1;
function fe(t) {
  K.add(t), Q || (Q = !0, Promise.resolve().then(() => {
    for (const e of K) e();
    K.clear(), Q = !1;
  }));
}
const nt = /* @__PURE__ */ new WeakMap();
let G = null;
function ct(t) {
  const e = () => {
    G = e, t(), G = null;
  };
  return e(), e;
}
function It(t, e) {
  if (!G) return;
  let n = nt.get(t);
  n || (n = /* @__PURE__ */ new Map(), nt.set(t, n));
  let i = n.get(e);
  i || (i = /* @__PURE__ */ new Set(), n.set(e, i)), i.add(G);
}
function Rt(t, e) {
  const n = nt.get(t);
  if (!n) return;
  const i = n.get(e);
  if (i)
    for (const c of i)
      fe(c);
}
function ae(t, e) {
  let n;
  typeof t == "function" ? n = t : xt(t) ? n = () => t.value : n = () => rt(t);
  let i;
  function c() {
    const r = n();
    e(r, i), i = r;
  }
  ct(c);
}
function xt(t) {
  return t && typeof t == "object" && t.__isRef;
}
function rt(t, e = /* @__PURE__ */ new Set()) {
  if (!(typeof t != "object" || t === null || e.has(t))) {
    if (e.add(t), xt(t))
      rt(t.value, e);
    else
      for (const n in t)
        rt(t[n], e);
    return t;
  }
}
function ue(t) {
  let e = t;
  return {
    get value() {
      return It(this, "value"), e;
    },
    set value(n) {
      n !== e && (e = n, Rt(this, "value"));
    },
    __isRef: !0
  };
}
function lt(t) {
  return new Proxy(t, {
    get(e, n, i) {
      const c = Reflect.get(e, n, i);
      return It(e, n), typeof c == "object" && c !== null ? lt(c) : c;
    },
    set(e, n, i, c) {
      const r = e[n], o = Reflect.set(e, n, i, c);
      return r !== i && Rt(e, n), o;
    }
  });
}
function ge(t, e) {
  const {
    data: { attrs: n, on: i },
    children: c
  } = t, r = T(e), o = lt({}), f = c;
  if (Object.keys(n).forEach((s) => {
    s !== "ref" && (o[s] = n[s]);
  }), Object.keys(i).forEach((s) => {
    i[s].parameters ? o[s] = function() {
      i[s].value(...i[s].parameters);
    } : o[s] = i[s].value;
  }), t.key && mt(t.key))
    return mt(t.key);
  const l = de({
    ...r,
    props: o,
    slot: f
  });
  return l.mount(), t.key && ce(l, t.key), l;
}
function de(t) {
  const e = Ot();
  yt(e);
  const n = t.bulk(t.props), { mounted: i, update: c } = me(), r = {
    render: t.render,
    _vnode: null,
    data: n,
    $el: null,
    appId: e,
    components: t.components ? t.components : [],
    sugar: {},
    slot: t.slot,
    props: t.props,
    headTag: t.headTag || "div"
  };
  function o() {
    i(r, n), x[e]?.forEach((s) => {
      s.fun(), s.used = !0;
    }), ct(() => {
      c(r);
    });
  }
  function f() {
    c(r);
  }
  function l(s) {
    r.slot = s, c(r);
  }
  return {
    vm: r,
    mount: o,
    ...n,
    updateSlot: l,
    forceUpdate: f
  };
}
function me() {
  let t = null;
  function e(r, o) {
    r.$el = document.createElement(r.headTag), r._vnode = r.$el, t = r.render, jt(r, o), r.forceUpdate = function() {
      n(r);
    };
  }
  function n(r) {
    const o = it(r), f = t.call(it(r));
    r.slot.length && i(f, r.slot), Pt(o, f), o._vnode = f;
  }
  function i(r, o) {
    for (let f = 0; f < r.children.length; f++) {
      const l = r.children[f];
      if (l.tag === "slot" && l.data.attrs?.name) {
        const s = o.find((a) => a.data?.attrs.slot === l.data.attrs.name);
        c(l, s, r.children);
      } else l.children?.length && i(l, o);
    }
  }
  function c(r, o, f) {
    f.splice(f.indexOf(r), 1, ...o.children);
  }
  return {
    update: n,
    mounted: e
  };
}
function he(t) {
  const { code: e, root: n } = At(t.render);
  return {
    ...t,
    render: e,
    headTag: n.tag
  };
}
function Pt(t, e) {
  let n = t._vnode;
  n.elm || (n = ye(n)), I(n, e) ? c(e, n) : n.elm?.parentNode && e && (R.insert(
    i(e),
    R.parentNode(n.elm),
    n.elm
  ), R.remove(n.elm));
  function i(s) {
    let a;
    if (s.tag) {
      if (typeof s.tag == "string" && !q(s, t.components)) {
        s.tag === "svg" || s.tag === "path" ? a = document.createElementNS("http://www.w3.org/2000/svg", s.tag) : a = document.createElement(s.tag);
        const { data: u = {} } = s || {}, { attrs: g = {}, on: m = {} } = u;
        for (const d in g)
          if (Object.hasOwnProperty.call(g, d)) {
            const h = g[d];
            a.setAttribute(d, h), d === "ref" && h in t && (t[h] = a);
          }
        const p = a._vei || (a._vei = {});
        for (const d in m)
          if (Object.hasOwnProperty.call(m, d) && m[d].value) {
            const h = (E) => {
              m[d].value(E), m[d].modifiers.includes("stop") && E.stopPropagation(), m[d].modifiers.includes("prevent") && E.preventDefault();
            };
            a.addEventListener(d, h), p[d] = h;
          }
        if (s.children)
          for (let d = 0; d < s.children.length; d++) {
            const h = i(s.children[d]);
            h && a.append(h);
          }
      } else if (q(s, t.components)) {
        const u = ge(s, t.components[s.tag]);
        s.elm = u.vm.$el, s._sugar = u, a = s.elm, s.data.attrs.ref && s.data.attrs.ref in t && (t[s.data.attrs.ref] = u);
      }
    } else s.text !== void 0 ? a = document.createTextNode(s.text) : s.elm !== void 0 && (a = s.elm);
    return s.elm = a, a;
  }
  function c(s, a) {
    if (q(s, t.components)) {
      if (a._sugar)
        pe(s, a), kt(s, t);
      else {
        const u = i(s);
        R.insert(u, R.parentNode(a.elm), a.elm), a.elm.remove(), a.elm = u;
      }
      return;
    }
    if (s.elm = a.elm, s.text !== void 0)
      a.text !== s.text && (a.elm.nodeValue = s.text);
    else if (s.tag) {
      if (r(s, a, t), a.children?.length)
        f(a.elm, a.children, s.children);
      else if (s.children.length > 0) {
        a.elm.innerHTML = "";
        for (let u = 0; u < s.children.length; u++) {
          const g = i(s.children[u]);
          g && a.elm.appendChild(g);
        }
      }
    }
  }
  function r(s, a, u) {
    const g = s.data.attrs, m = s.data.on, p = a.data.attrs, d = s.elm;
    o(d, p, g, u), Se(d, m);
  }
  function o(s, a, u, g) {
    a && Object.keys(a).forEach((m) => {
      u[m] !== a[m] && s.removeAttribute(m);
    }), Object.keys(u).forEach((m) => {
      m === "value" && (s.value = u[m]), (!a || u[m] !== a[m]) && s.setAttribute(m, u[m]), m === "ref" && u[m] in g && (g[u[m]] = s);
    });
  }
  function f(s, a, u) {
    a = ht(a), u = ht(u);
    let g = 0, m = a.length - 1, p = 0, d = u.length - 1, h = a[g], E = a[m], y = u[p], $ = u[d], z, k, j, C;
    for (; g <= m && p <= d; )
      !h || !a[g] ? h = a[++g] : !E || !a[m] ? E = a[--m] : !y || !u[p] ? y = u[++p] : !$ || !u[d] ? $ = u[--d] : I(y, h) ? (c(y, h), h = a[++g], y = u[++p]) : I(y, E) ? (c(y, E), s.insertBefore(E.elm, h.elm), E = a[--m], y = u[++p]) : I($, h) ? (c($, h), s.insertBefore(h.elm, E.elm.nextSibling), h = a[++g], $ = u[--d]) : I($, E) ? (c($, E), E = a[--m], $ = u[--d]) : (W(z) && (z = l(a, g, m)), k = dt(y.key) ? z[y.key] : null, W(k) ? (s.insertBefore(i(y), h.elm), y = u[++p]) : (j = a[k], I(j, y) ? (c(y, j), a[k] = void 0, s.insertBefore(j.elm, h.elm)) : s.insertBefore(i(y), h.elm), y = u[++p]));
    if (g > m)
      for (C = W(u[d + 1]) ? null : u[d + 1].elm; p <= d; p++)
        C ? s.insertBefore(i(u[p]), C) : s.append(i(u[p]));
    if (p > d)
      for (let L = g; L <= m; L++)
        a[L]?.elm && s.removeChild(a[L].elm);
  }
  function l(s, a, u) {
    let g, m;
    const p = {};
    for (g = a; g <= u; ++g)
      m = s[g].key, dt(m) && (p[m] = g);
    return p;
  }
}
function pe(t, e) {
  Object.keys(e._sugar.vm.props).forEach((n) => {
    const { attrs: i, on: c } = t.data;
    Object.keys(i).includes(n) ? e._sugar.vm.props[n] = t.data.attrs[n] : Object.keys(c).includes(n) && (t.data.on[n].parameters ? e._sugar.vm.props[n] = function() {
      t.data.on[n].value(...t.data.on[n].parameters);
    } : e._sugar.vm.props[n] = t.data.on[n].value);
  }), e._sugar.updateSlot(t.children), t.elm = e.elm, t._sugar = e._sugar;
}
function ye(t) {
  return new Ee(t.tagName.toLowerCase(), {}, [], t);
}
function I(t, e) {
  return t.key === e.key && t.tag === e.tag;
}
function Se(t, e) {
  const n = t._vei || (t._vei = {});
  Object.keys(n).forEach((i) => {
    t.removeEventListener(i, n[i]);
  }), Object.keys(e).forEach((i) => {
    n[i] = (c) => {
      e[i].modifiers.includes("stop") && c.stopPropagation(), e[i].modifiers.includes("prevent") && c.preventDefault(), e[i].value(c);
    }, t.addEventListener(i, n[i]);
  });
}
function ht(t) {
  return t.filter((e) => e.tag || e.text === "" || e.text || e.elm);
}
function kt(t, e) {
  const n = t.data;
  if (n) {
    const i = n.attrs;
    i.ref && e[i.ref] in e && (e[i.ref] = t.elm);
  }
  t.children && t.children.forEach((i) => {
    kt(i, e);
  });
}
let Ee = class {
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
function _e() {
  let t = null;
  function e(i, c) {
    const r = new XMLSerializer();
    if (i.render)
      t = i.render;
    else {
      const o = i.render ? i.render : Yt(r.serializeToString(i.$el)), { code: f } = At(o);
      t = f;
    }
    jt(i, c), ct(() => {
      n(i);
    });
  }
  function n(i) {
    const c = it(i), r = t?.call(c);
    Pt(c, r), c._vnode = r;
  }
  return {
    update: n,
    mounted: e
  };
}
function it(t) {
  return new Proxy(t, {
    get(e, n, i) {
      const c = Reflect.get(e, n, i);
      return pt(c) ? c.value : c;
    },
    set(e, n, i, c) {
      const r = Reflect.get(e, n, c);
      return pt(r) ? r.value = i : Reflect.set(e, n, i), !0;
    }
  });
}
function pt(t) {
  return !!t?.__isRef;
}
function jt(t, e) {
  Object.keys(e).forEach((l) => {
    t[l] = e[l];
  });
  function n(l = "div", s = {}, a = []) {
    return Lt(l, s, a);
  }
  function i(l) {
    const s = new Mt();
    return s.text = l, s;
  }
  function c(l) {
    return String(l);
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
  function o(l) {
    return be(l);
  }
  function f(l, s) {
    const a = [];
    return s.forEach((u, g) => {
      a.push({
        ...l(u, g)
      });
    }), a;
  }
  t._SUGAR = {
    _c: n,
    _v: i,
    _s: c,
    _e: r,
    _loop: f,
    _html: o
  };
}
function Lt(t = "div", e = {}, n = []) {
  return ((c = "div", r = {}, o = []) => {
    const f = [];
    return o && o.length > 0 && o.forEach((l) => {
      f.push(l);
    }), new Mt(c, r, f);
  })(t, e, n);
}
class Mt {
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
function be(t) {
  function e(i) {
    const c = {
      attrs: {},
      on: {}
    };
    Array.from(i.attributes).forEach((o) => {
      c.attrs[o.name] = o.value;
    });
    const r = Lt(i.tagName, c, []);
    return Array.from(i.childNodes).forEach((o) => {
      o.nodeType === 1 ? r.children.push(e(o)) : o.nodeType === 3 && r.children.push({
        tag: "",
        content: o.textContent,
        children: [],
        elm: void 0,
        text: o.textContent,
        key: void 0,
        data: void 0
      });
    }), r;
  }
  const n = document.createElement("div");
  return n.innerHTML = t, e(n);
}
function ve() {
  Vt(`
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
function Oe(t) {
  const e = Ot();
  yt(e);
  const n = t.bulk(t.props), i = {}, { mounted: c } = _e(), r = {
    render: t.render,
    _vnode: null,
    data: n,
    $el: null,
    appId: e,
    components: [],
    sugar: {},
    slot: t.slot,
    forceUpdate: () => {
    }
  };
  function o(l) {
    ve(), r._vnode = r.$el = typeof l == "string" ? document.querySelector(`${l}`) : l, c(r, n), Tt(() => {
      x[e]?.forEach((s) => {
        s.fun(), s.used = !0;
      });
    });
  }
  function f(l) {
    w(l) || (l = [l]), l.forEach((s) => {
      s.name ? (r.components[s.name] = s, r.components[s.name].components = r.components) : s.fun && (i[s.fun] = s.bulk);
    }), r.$el && r.forceUpdate();
  }
  return {
    vm: r,
    mount: o,
    ...n,
    use: f,
    $: i
  };
}
typeof window < "u" && (function(t) {
  t.SUGAR = {
    onMounted: Ut,
    createApp: Oe,
    nextTick: Tt,
    ref: ue,
    Component: he,
    reactive: lt,
    watch: ae
  };
})(window);
export {
  he as Component,
  Oe as createApp,
  Tt as nextTick,
  Ut as onMounted,
  lt as reactive,
  ue as ref,
  At as sugarCompiler,
  ae as watch
};
