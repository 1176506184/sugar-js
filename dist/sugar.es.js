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
function Gt(t) {
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
function wt() {
  st.pop();
}
function St(t, e) {
  const n = ot(e), r = [];
  for (; !Dt(t, e); ) {
    const o = t.source;
    let l;
    if (_(o, t.options.delimiters[0]))
      l = Xt(t);
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
          l = dt(t);
      else /[a-z]/i.test(o[1]) ? l = Wt(t, e) : o[1] === "!" && (l = dt(t));
    if (l || (l = qt(t)), Nt(l))
      for (let f = 0; f < l.length; f++)
        ut(r, l[f]);
    else
      ut(r, l);
  }
  let c = !1;
  const i = t.options.whitespace !== "preserve";
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    if (l.type === 2)
      if (t.inPre)
        l.content = l.content.replace(/\r\n/g, `
`);
      else if (/[^\t\r\n\f ]/.test(l.content))
        i && (l.content = l.content.replace(/[\t\r\n\f ]+/g, " "));
      else {
        const f = r[o - 1], s = r[o + 1];
        !f || !s || i && (f.type === 3 && s.type === 3 || f.type === 3 && s.type === 1 || f.type === 1 && s.type === 3 || f.type === 1 && s.type === 1 && /[\r\n]/.test(l.content)) ? (c = !0, r[o] = null) : l.content = " ";
      }
    else l.type === 3 && !t.options.comments && (c = !0, r[o] = null);
  }
  if (t.inPre && n && t.options.isPreTag(n.tag)) {
    const o = r[0];
    o && o.type === 2 && (o.content = o.content.replace(/^\r?\n/, ""));
  }
  return c ? r.filter(Boolean) : r;
}
function zt(t, e) {
  const n = [], r = /* @__PURE__ */ new Set(), c = t.source.slice(0, t.source.indexOf(">")).match(/s-for\s*=\s*["']\s*\(([^)]+)\)\s+in\s+[^"']+["']/);
  if (c) {
    const i = c[1].split(",").map((o) => o.trim());
    ft(i);
  } else e === 0 && ft([]);
  for (; t.source.length > 0 && !_(t.source, ">") && !_(t.source, "/>"); ) {
    if (_(t.source, "/")) {
      S(t, 1), P(t);
      continue;
    }
    const i = Ct(t, r);
    if (["s-if", "s-html"].includes(i.name) && (i.value.content = B(i.value.content)), i.name === "s-for") {
      const o = i.value.content.split(" in ");
      i.value.content = o[0] + " in " + B(o[1]);
    }
    i.type === 6 && i.value && i.name === "class" && (i.value.content = i.value.content.replace(/\s+/g, " ").trim()), e === 0 && n.push(i), P(t);
  }
  return n;
}
function Ct(t, e) {
  const n = O(t), c = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(t.source)[0];
  e.add(c), S(t, c.length);
  let i;
  /^[\t\r\n\f ]*=/.test(t.source) && (P(t), S(t, 1), P(t), i = Ht(t));
  const o = A(t, n);
  if (!t.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(c)) {
    const l = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(c), f = _(c, "."), s = l[1] || (f || _(c, ":") ? "bind" : _(c, "@") || _(c, "s-on:") ? "on" : "slot");
    let a;
    if (l[2]) {
      const d = s === "slot", m = c.lastIndexOf(l[2], c.length - (l[3]?.length || 0)), p = A(
        t,
        at(t, n, m),
        at(
          t,
          n,
          m + l[2].length + (d && l[3] || "").length
        )
      );
      let g = l[2];
      g.startsWith("[") ? g.endsWith("]") ? g = g.slice(1, g.length - 1) : g = g.slice(1) : d && (g += l[3] || ""), a = {
        type: 4,
        content: g,
        loc: p
      };
    }
    if (i?.isQuoted) {
      const d = i.loc;
      d.start.offset++, d.start.column++, d.end = _t(d.start, i.content), d.source = d.source.slice(1, -1);
    }
    const u = l[3] ? l[3].slice(1).split(".") : [];
    return f && u.push("prop"), {
      type: 7,
      name: s,
      exp: i && {
        type: 4,
        content: B(i.content),
        loc: i.loc,
        isStatic: !Gt(i.content)
      },
      arg: a,
      modifiers: u,
      loc: o
    };
  }
  return {
    type: 6,
    name: c,
    value: i && {
      type: 2,
      content: i.content,
      loc: i.loc
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
  const r = t.source[0], c = r === '"' || r === "'";
  if (c) {
    S(t, 1);
    const i = t.source.indexOf(r);
    i === -1 ? n = U(t, t.source.length) : (n = U(t, i), S(t, 1));
  } else {
    const i = /^[^\t\r\n\f >]+/.exec(t.source);
    if (!i)
      return;
    n = U(t, i[0].length);
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
  const r = St(t, e);
  return e.pop(), n.children = r, bt(t.source, n.tag) && Z(
    t,
    1
    /* End */
  ), n.loc = A(t, n.loc.start), n;
}
function Z(t, e, n) {
  const r = O(t), c = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(t.source), i = c[1];
  S(t, c[0].length), P(t);
  const o = zt(t, e);
  let l = !1;
  if (t.source.length !== 0 && (l = _(t.source, "/>"), S(t, l ? 2 : 1)), e === 1) {
    wt();
    return;
  }
  return {
    type: 1,
    tag: i,
    tagType: 0,
    children: [],
    props: o,
    isSelfClosing: l,
    loc: A(t, r)
  };
}
var Et = /* @__PURE__ */ ((t) => (t[t.HTML = 0] = "HTML", t))(Et || {});
function dt(t) {
  const e = O(t), n = t.source[1] === "?" ? 1 : 2;
  let r;
  const c = t.source.indexOf("-->") + 2;
  return c === -1 ? (r = t.source.slice(n), S(t, t.source.length)) : (r = t.source.slice(n, c), S(t, c + 1)), {
    type: 3,
    content: r,
    loc: A(t, e)
  };
}
function Dt(t, e) {
  const n = t.source;
  if (_(n, "</")) {
    for (let r = e.length - 1; r >= 0; --r)
      if (bt(n, e[r].tag))
        return !0;
  }
  return !n;
}
function Xt(t) {
  const [e, n] = t.options.delimiters, r = t.source.indexOf(n, e.length), c = O(t);
  S(t, e.length);
  const i = O(t), o = O(t), l = r - e.length, f = t.source.slice(0, l), s = Kt(t, l), a = s.trim(), u = s.indexOf(a);
  u > 0 && F(i, f, u);
  const d = l - (s.length - a.length - u);
  return F(o, f, d), S(t, n.length), {
    type: 5,
    content: {
      type: 4,
      content: B(a),
      loc: A(t, i, o)
    },
    loc: A(t, c)
  };
}
function qt(t) {
  const e = ["<", t.options.delimiters[0]];
  let n = t.source.length;
  for (let i = 0; i < e.length; i++) {
    const o = t.source.indexOf(e[i], 1);
    o !== -1 && n > o && (n = o);
  }
  const r = O(t);
  return {
    type: 2,
    content: U(t, n),
    loc: A(t, r)
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
  let r = 0, c = -1;
  for (let i = 0; i < n; i++)
    e.charCodeAt(i) === 10 && (r++, c = i);
  return t.offset += n, t.line += r, t.column = c === -1 ? t.column + n : n - c, t;
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
  const { column: e, line: n, offset: r } = t;
  return {
    column: e,
    line: n,
    offset: r
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
  return t.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (e, n, r, c) => {
    const i = c.slice(0, r), o = /'[^']*$/.test(i) && /[^']*'/.test(c.slice(r)), l = /"[^"]*$/.test(i) && /[^"]*"/.test(c.slice(r)), f = /`[^`]*$/.test(i) && /[^`]*`/.test(c.slice(r));
    if (o || l || f) return e;
    const s = c[r - 1];
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
}, G = (t) => t instanceof Array;
function gt(t) {
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
  return t.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(n, r) {
    return e[r];
  }).replace(/<[^>]+s-on:([^>]+)>/gi, function(n, r) {
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
    const i = /* @__PURE__ */ new Set();
    for (const o of t)
      i.add(T(o), e);
    return i;
  }
  if (b.Map(t)) {
    const i = /* @__PURE__ */ new Map();
    for (const o of t) i.set(T(o[0], e), T(o[1], e));
    return i;
  }
  if (e.has(t)) return e.get(t);
  if (b.Array(t)) {
    const i = [];
    for (const o in t) i[o] = T(t[o], e);
    return i;
  }
  if (!b.Object(t)) return t;
  const r = b.Array(t) ? [] : {};
  e.set(t, r);
  for (const i in t)
    b.Array(t[i]) && T(t[i], e), e.set(t, r), r[i] = T(t[i], e);
  const c = Object.getOwnPropertySymbols(t);
  for (const i of c)
    r[i] = T(t[i], e);
  return r;
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
    const r = function() {
      try {
        e.styleSheet.cssText = t;
      } catch {
      }
    };
    e.styleSheet.disabled ? setTimeout(r, 10) : r();
  } else {
    const r = document.createTextNode(t);
    e.appendChild(r);
  }
  n.appendChild(e);
}
function Y(t, e) {
  function n(r) {
    r.props?.forEach((i) => {
      i.name === "s-if" && e.sIf(r, i), i.name === "s-for" && e.sFor(r, i), i.name === "s-html" && e.sHtml(r, i), i.name === "s-model" && e.sModel(r, i), i.name === "s-loading" && e.sLoading(r, i);
    }), r.tag === "slot" && (r.type = v.SLOT), r.children && r.children.forEach((i) => {
      n(i);
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
  const e = (i = []) => {
    let o = "[";
    return i.forEach((l, f) => {
      l.type === v.ELEMENT || l.type === v.INTERPOLATION || l.type === v.SLOT ? o += n(l) + `${f === i.length - 1 ? "" : ","}` : l.type === v.TEXT && l.content.trim() && (o += n(l) + `${f === i.length - 1 ? "" : ","}`);
    }), o + "]";
  };
  function n(i) {
    let o = "";
    const l = i.props;
    if (i.type === 1 || i.type === v.SLOT) {
      let f = "", s = !1;
      if (f += `_ctx_._SUGAR._c('${i.tag}',{ `, f += '"attrs":{', f += D(l), f += '},"on":{', f += X(l), f += "}},", i.children ? f += e(i.children) : f += "[]", f += ")", i.forStatment && (s = !0, o += c(i)), i.if && !i.forStatment && (s = !0, o = `${i.if.value} ? ${o + f} : _ctx_._SUGAR._e()`), i.loading && !i.forStatment) {
        s = !0;
        const a = N(
          Y(
            J(`<div class="s-loading" s-if="${i.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            {
              sIf: V
            }
          )
        );
        o = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${o + (i.if ? "" : f)},${a}])`;
      }
      i.htmlStatment && (s = !0, o = `_ctx_._SUGAR._c('div',{attrs:{${D(l)}},on:{${X(l)}}},[_ctx_._SUGAR._html(${i.htmlStatment.value.content})])`), s || (o += f);
    } else i.type === v.INTERPOLATION ? o += `_ctx_._SUGAR._v(_ctx_._SUGAR._s(${i.content.content}))` : i.type === v.TEXT && (o += `_ctx_._SUGAR._v(decodeURIComponent("${encodeURIComponent(i.content)}"))`);
    return o;
  }
  return n(t);
  function r(i, o, l) {
    let f = `_ctx_._SUGAR._c('${i}',{`;
    return f += '"attrs":{', f += D(o), f += '},"on":{', f += X(o), f += "}},[", l.forEach((s, a) => {
      f += N(s), a < l.length - 1 && (f += ",");
    }), f += "])", o.forEach((s) => {
      if (s.name === "s-if" && (f = `${s.value.content} ? ${f} : _ctx_._SUGAR._e()`), s.name === "s-loading" && s.value) {
        const a = N(
          Y(
            J(`<div class="s-loading" s-if="${s.value.content}">
          <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            { sIf: V }
          )
        );
        f = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${f},${a}])`;
      }
    }), f;
  }
  function c(i) {
    const o = i.forStatment, l = r(i.tag, i.props, i.children);
    return `..._ctx_._SUGAR._loop((${o.item}${o.index ? "," + o.index : ""})=>{
      return ${l}
    },${o.exp})`;
  }
}
function D(t) {
  let e = "";
  return t = t.filter((n) => n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "s-loading" && n.name !== "s-html"), t.forEach((n, r) => {
    n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "bind" && n.name !== "slot" && n.name !== "s-html" ? e += `"${n.name}":"${n.value.content}"` : n.name === "bind" ? e += `"${n.arg.content}":${n.exp.content}` : n.name === "slot" && (e += `"slot":"${n.arg.content}"`), n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && r < t.length - 1 && (e += ",");
  }), e;
}
function X(t) {
  let e = "";
  return t = t.filter((n) => n.name === "on"), t.forEach((n, r) => {
    if (n.name === "on") {
      let c = `${n.exp.content}`;
      n.exp.isStatic && (c = `(e)=>{${n.exp.content}}`), e += `"${n.arg.content}":{"value":${c},"isStatic":${n.exp.isStatic},"modifiers":[${te(n.modifiers)}]}`, n.name === "on" && r < t.length - 1 && (e += ",");
    }
  }), e;
}
function te(t) {
  return G(t) ? t.map((e) => `"${e}"`) : "";
}
function ee(t, e) {
  const n = e.value.content.split(" in "), r = new RegExp("(?<=\\()(.+?)(?=\\))");
  n[0] = n[0].match(r) ? n[0].match(r)[0].split(",") : n[0], t.forStatment = {
    exp: n[1],
    item: G(n[0]) ? n[0][0] : n[0],
    index: G(n[0]) ? n[0][1] : null
  };
}
function ne(t, e) {
  t.htmlStatment = {
    value: e.value
  };
}
function ie(t, e) {
  t.loading = {
    value: e.value.content,
    type: e.value.type
  };
}
function re(t, e) {
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
    sLoading: ie,
    transformEvent: re,
    sModel: se
  }), {
    root: e,
    code: N(e)
  };
}
function At(t) {
  function e(r = "") {
    const { code: c, root: i } = oe(r);
    return {
      code: n(c),
      root: i
    };
  }
  function n(r = "") {
    return new Function(`    const _ctx_ = this;
    const proxy = new Proxy({}, {
      get(target, prop, receiver) {
        if (prop in ctx) {
          return ctx[prop];
        }
        throw new ReferenceError(\`Missing variable \${String(prop)} in template\`);
      }
    });
    return ${r.toString()};
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
    return await new Promise((n, r) => {
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
let w = null;
function ct(t) {
  const e = () => {
    w = e, t(), w = null;
  };
  return e(), e;
}
function It(t, e) {
  if (!w) return;
  let n = nt.get(t);
  n || (n = /* @__PURE__ */ new Map(), nt.set(t, n));
  let r = n.get(e);
  r || (r = /* @__PURE__ */ new Set(), n.set(e, r)), r.add(w);
}
function Rt(t, e) {
  const n = nt.get(t);
  if (!n) return;
  const r = n.get(e);
  if (r)
    for (const c of r)
      fe(c);
}
function ae(t, e) {
  let n;
  typeof t == "function" ? n = t : xt(t) ? n = () => t.value : n = () => it(t);
  let r;
  function c() {
    const i = n();
    e(i, r), r = i;
  }
  ct(c);
}
function xt(t) {
  return t && typeof t == "object" && t.__isRef;
}
function it(t, e = /* @__PURE__ */ new Set()) {
  if (!(typeof t != "object" || t === null || e.has(t))) {
    if (e.add(t), xt(t))
      it(t.value, e);
    else
      for (const n in t)
        it(t[n], e);
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
    get(e, n, r) {
      const c = Reflect.get(e, n, r);
      return It(e, n), typeof c == "object" && c !== null ? lt(c) : c;
    },
    set(e, n, r, c) {
      const i = e[n], o = Reflect.set(e, n, r, c);
      return i !== r && Rt(e, n), o;
    }
  });
}
function de(t) {
  return t || {};
}
function ge(t, e) {
  const {
    data: { attrs: n, on: r },
    children: c
  } = t, i = T(e), o = lt({}), l = c;
  if (Object.keys(n).forEach((s) => {
    s !== "ref" && (o[s] = n[s]);
  }), Object.keys(r).forEach((s) => {
    r[s].parameters ? o[s] = function() {
      r[s].value(...r[s].parameters);
    } : o[s] = r[s].value;
  }), t.key && mt(t.key))
    return mt(t.key);
  const f = me({
    ...i,
    props: o,
    slot: l
  });
  return f.mount(), t.key && ce(f, t.key), f;
}
function me(t) {
  const e = Ot();
  yt(e);
  const n = t.bulk(t.props), { mounted: r, update: c } = he(), i = {
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
    r(i, n), x[e]?.forEach((s) => {
      s.fun(), s.used = !0;
    }), ct(() => {
      c(i);
    });
  }
  function l() {
    c(i);
  }
  function f(s) {
    i.slot = s, c(i);
  }
  return {
    vm: i,
    mount: o,
    ...n,
    updateSlot: f,
    forceUpdate: l
  };
}
function he() {
  let t = null;
  function e(i, o) {
    i.$el = document.createElement(i.headTag), i._vnode = i.$el, t = i.render, jt(i, o), i.forceUpdate = function() {
      n(i);
    };
  }
  function n(i) {
    const o = rt(i), l = t.call(rt(i));
    i.slot.length && r(l, i.slot), Pt(o, l), o._vnode = l;
  }
  function r(i, o) {
    for (let l = 0; l < i.children.length; l++) {
      const f = i.children[l];
      if (f.tag === "slot" && f.data.attrs?.name) {
        const s = o.find((a) => a.data?.attrs.slot === f.data.attrs.name);
        c(f, s, i.children);
      } else f.children?.length && r(f, o);
    }
  }
  function c(i, o, l) {
    if (!o) {
      l.splice(l.indexOf(i), 1, []);
      return;
    }
    l.splice(l.indexOf(i), 1, ...o.children);
  }
  return {
    update: n,
    mounted: e
  };
}
function pe(t) {
  const { code: e, root: n } = At(t.render);
  return {
    ...t,
    render: e,
    headTag: n.tag
  };
}
function Pt(t, e) {
  let n = t._vnode;
  n.elm || (n = Se(n)), I(n, e) ? c(e, n) : n.elm?.parentNode && e && (R.insert(
    r(e),
    R.parentNode(n.elm),
    n.elm
  ), R.remove(n.elm));
  function r(s) {
    let a;
    if (s.tag) {
      if (typeof s.tag == "string" && !q(s, t.components)) {
        s.tag === "svg" || s.tag === "path" ? a = document.createElementNS("http://www.w3.org/2000/svg", s.tag) : a = document.createElement(s.tag);
        const { data: u = {} } = s || {}, { attrs: d = {}, on: m = {} } = u;
        for (const g in d)
          if (Object.hasOwnProperty.call(d, g)) {
            const h = d[g];
            a.setAttribute(g, h), g === "ref" && h in t && (t[h] = a);
          }
        const p = a._vei || (a._vei = {});
        for (const g in m)
          if (Object.hasOwnProperty.call(m, g) && m[g].value) {
            const h = (E) => {
              m[g].value(E), m[g].modifiers.includes("stop") && E.stopPropagation(), m[g].modifiers.includes("prevent") && E.preventDefault();
            };
            a.addEventListener(g, h), p[g] = h;
          }
        if (s.children)
          for (let g = 0; g < s.children.length; g++) {
            const h = r(s.children[g]);
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
        ye(s, a), kt(s, t);
      else {
        const u = r(s);
        R.insert(u, R.parentNode(a.elm), a.elm), a.elm.remove(), a.elm = u;
      }
      return;
    }
    if (s.elm = a.elm, s.text !== void 0)
      a.text !== s.text && (a.elm.nodeValue = s.text);
    else if (s.tag) {
      if (i(s, a, t), a.children?.length)
        l(a.elm, a.children, s.children);
      else if (s.children.length > 0) {
        a.elm.innerHTML = "";
        for (let u = 0; u < s.children.length; u++) {
          const d = r(s.children[u]);
          d && a.elm.appendChild(d);
        }
      }
    }
  }
  function i(s, a, u) {
    const d = s.data.attrs, m = s.data.on, p = a.data.attrs, g = s.elm;
    o(g, p, d, u), Ee(g, m);
  }
  function o(s, a, u, d) {
    a && Object.keys(a).forEach((m) => {
      u[m] !== a[m] && s.removeAttribute(m);
    }), Object.keys(u).forEach((m) => {
      m === "value" && (s.value = u[m]), (!a || u[m] !== a[m]) && s.setAttribute(m, u[m]), m === "ref" && u[m] in d && (d[u[m]] = s);
    });
  }
  function l(s, a, u) {
    a = ht(a), u = ht(u);
    let d = 0, m = a.length - 1, p = 0, g = u.length - 1, h = a[d], E = a[m], y = u[p], $ = u[g], z, k, j, C;
    for (; d <= m && p <= g; )
      !h || !a[d] ? h = a[++d] : !E || !a[m] ? E = a[--m] : !y || !u[p] ? y = u[++p] : !$ || !u[g] ? $ = u[--g] : I(y, h) ? (c(y, h), h = a[++d], y = u[++p]) : I(y, E) ? (c(y, E), s.insertBefore(E.elm, h.elm), E = a[--m], y = u[++p]) : I($, h) ? (c($, h), s.insertBefore(h.elm, E.elm.nextSibling), h = a[++d], $ = u[--g]) : I($, E) ? (c($, E), E = a[--m], $ = u[--g]) : (W(z) && (z = f(a, d, m)), k = gt(y.key) ? z[y.key] : null, W(k) ? (s.insertBefore(r(y), h.elm), y = u[++p]) : (j = a[k], I(j, y) ? (c(y, j), a[k] = void 0, s.insertBefore(j.elm, h.elm)) : s.insertBefore(r(y), h.elm), y = u[++p]));
    if (d > m)
      for (C = W(u[g + 1]) ? null : u[g + 1].elm; p <= g; p++)
        C ? s.insertBefore(r(u[p]), C) : s.append(r(u[p]));
    if (p > g)
      for (let L = d; L <= m; L++)
        a[L]?.elm && s.removeChild(a[L].elm);
  }
  function f(s, a, u) {
    let d, m;
    const p = {};
    for (d = a; d <= u; ++d)
      m = s[d].key, gt(m) && (p[m] = d);
    return p;
  }
}
function ye(t, e) {
  Object.keys(e._sugar.vm.props).forEach((n) => {
    const { attrs: r, on: c } = t.data;
    Object.keys(r).includes(n) ? e._sugar.vm.props[n] = t.data.attrs[n] : Object.keys(c).includes(n) && (t.data.on[n].parameters ? e._sugar.vm.props[n] = function() {
      t.data.on[n].value(...t.data.on[n].parameters);
    } : e._sugar.vm.props[n] = t.data.on[n].value);
  }), e._sugar.updateSlot(t.children), t.elm = e.elm, t._sugar = e._sugar;
}
function Se(t) {
  return new _e(t.tagName.toLowerCase(), {}, [], t);
}
function I(t, e) {
  return t.key === e.key && t.tag === e.tag;
}
function Ee(t, e) {
  const n = t._vei || (t._vei = {});
  Object.keys(n).forEach((r) => {
    t.removeEventListener(r, n[r]);
  }), Object.keys(e).forEach((r) => {
    n[r] = (c) => {
      e[r].modifiers.includes("stop") && c.stopPropagation(), e[r].modifiers.includes("prevent") && c.preventDefault(), e[r].value(c);
    }, t.addEventListener(r, n[r]);
  });
}
function ht(t) {
  return t.filter((e) => e.tag || e.text === "" || e.text || e.elm);
}
function kt(t, e) {
  const n = t.data;
  if (n) {
    const r = n.attrs;
    r.ref && e[r.ref] in e && (e[r.ref] = t.elm);
  }
  t.children && t.children.forEach((r) => {
    kt(r, e);
  });
}
let _e = class {
  tag;
  data;
  elm;
  context;
  text;
  key;
  _sugar;
  constructor(e, n, r, c) {
    this.tag = e, this.data = n, this.children = r, this.key = n.attrs?.key, this.elm = c, this.context = void 0, this.text = void 0;
  }
};
function be() {
  let t = null;
  function e(r, c) {
    const i = new XMLSerializer();
    if (r.render)
      t = r.render;
    else {
      const o = r.render ? r.render : Yt(i.serializeToString(r.$el)), { code: l } = At(o);
      t = l;
    }
    jt(r, c), ct(() => {
      n(r);
    });
  }
  function n(r) {
    const c = rt(r), i = t?.call(c);
    Pt(c, i), c._vnode = i;
  }
  return {
    update: n,
    mounted: e
  };
}
function rt(t) {
  return new Proxy(t, {
    get(e, n, r) {
      const c = Reflect.get(e, n, r);
      return pt(c) ? c.value : c;
    },
    set(e, n, r, c) {
      const i = Reflect.get(e, n, c);
      return pt(i) ? i.value = r : Reflect.set(e, n, r), !0;
    }
  });
}
function pt(t) {
  return !!t?.__isRef;
}
function jt(t, e) {
  Object.keys(e).forEach((f) => {
    t[f] = e[f];
  });
  function n(f = "div", s = {}, a = []) {
    return Lt(f, s, a);
  }
  function r(f) {
    const s = new Mt();
    return s.text = f, s;
  }
  function c(f) {
    return String(f);
  }
  function i() {
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
  function o(f) {
    return ve(f);
  }
  function l(f, s) {
    const a = [];
    return s.forEach((u, d) => {
      a.push({
        ...f(u, d)
      });
    }), a;
  }
  t._SUGAR = {
    _c: n,
    _v: r,
    _s: c,
    _e: i,
    _loop: l,
    _html: o
  };
}
function Lt(t = "div", e = {}, n = []) {
  return ((c = "div", i = {}, o = []) => {
    const l = [];
    return o && o.length > 0 && o.forEach((f) => {
      l.push(f);
    }), new Mt(c, i, l);
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
  constructor(e, n, r) {
    this.tag = e, this.data = n, this.children = r, this.elm = void 0, this.context = void 0, this.text = void 0, this.key = n?.attrs?.key;
  }
}
function ve(t) {
  function e(r) {
    const c = {
      attrs: {},
      on: {}
    };
    Array.from(r.attributes).forEach((o) => {
      c.attrs[o.name] = o.value;
    });
    const i = Lt(r.tagName, c, []);
    return Array.from(r.childNodes).forEach((o) => {
      o.nodeType === 1 ? i.children.push(e(o)) : o.nodeType === 3 && i.children.push({
        tag: "",
        content: o.textContent,
        children: [],
        elm: void 0,
        text: o.textContent,
        key: void 0,
        data: void 0
      });
    }), i;
  }
  const n = document.createElement("div");
  return n.innerHTML = t, e(n);
}
function Oe() {
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
function Ae(t) {
  const e = Ot();
  yt(e);
  const n = t.bulk(t.props), r = {}, { mounted: c } = be(), i = {
    render: t.render,
    _vnode: null,
    data: n,
    $el: null,
    appId: e,
    components: t.components || [],
    sugar: {},
    slot: t.slot,
    forceUpdate: () => {
    }
  };
  function o(f) {
    Oe(), i._vnode = i.$el = typeof f == "string" ? document.querySelector(`${f}`) : f, c(i, n), Tt(() => {
      x[e]?.forEach((s) => {
        s.fun(), s.used = !0;
      });
    });
  }
  function l(f) {
    G(f) || (f = [f]), f.forEach((s) => {
      s.name ? (i.components[s.name] = s, i.components[s.name].components = i.components) : s.fun && (r[s.fun] = s.bulk);
    }), i.$el && i.forceUpdate();
  }
  return {
    vm: i,
    mount: o,
    ...n,
    use: l,
    $: r
  };
}
typeof window < "u" && (function(t) {
  t.SUGAR = {
    onMounted: Ut,
    createApp: Ae,
    nextTick: Tt,
    ref: ue,
    Component: pe,
    reactive: lt,
    watch: ae,
    defineProps: de
  };
})(window);
export {
  pe as Component,
  Ae as createApp,
  de as defineProps,
  Tt as nextTick,
  Ut as onMounted,
  lt as reactive,
  ue as ref,
  At as sugarCompiler,
  ae as watch
};
