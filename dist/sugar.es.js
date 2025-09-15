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
  const n = ct(e), r = [];
  for (; !qt(t, e); ) {
    const s = t.source;
    let l;
    if (b(s, t.options.delimiters[0]))
      l = Kt(t);
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
          l = gt(t);
      else /[a-z]/i.test(s[1]) ? l = Xt(t, e) : s[1] === "!" && (l = gt(t));
    if (l || (l = Qt(t)), Bt(l))
      for (let a = 0; a < l.length; a++)
        mt(r, l[a]);
    else
      mt(r, l);
  }
  let o = !1;
  const i = t.options.whitespace !== "preserve";
  for (let s = 0; s < r.length; s++) {
    const l = r[s];
    if (l.type === 2)
      if (t.inPre)
        l.content = l.content.replace(/\r\n/g, `
`);
      else if (/[^\t\r\n\f ]/.test(l.content))
        i && (l.content = l.content.replace(/[\t\r\n\f ]+/g, " "));
      else {
        const a = r[s - 1], u = r[s + 1];
        !a || !u || i && (a.type === 3 && u.type === 3 || a.type === 3 && u.type === 1 || a.type === 1 && u.type === 3 || a.type === 1 && u.type === 1 && /[\r\n]/.test(l.content)) ? (o = !0, r[s] = null) : l.content = " ";
      }
    else l.type === 3 && !t.options.comments && (o = !0, r[s] = null);
  }
  if (t.inPre && n && t.options.isPreTag(n.tag)) {
    const s = r[0];
    s && s.type === 2 && (s.content = s.content.replace(/^\r?\n/, ""));
  }
  return o ? r.filter(Boolean) : r;
}
function Dt(t, e) {
  const n = [], r = /* @__PURE__ */ new Set(), o = t.source.slice(0, t.source.indexOf(">")).match(/s-for\s*=\s*["']\s*\(([^)]+)\)\s+in\s+[^"']+["']/);
  if (o) {
    const i = o[1].split(",").map((s) => s.trim());
    lt(i);
  } else e === 0 && lt([]);
  for (; t.source.length > 0 && !b(t.source, ">") && !b(t.source, "/>"); ) {
    if (b(t.source, "/")) {
      E(t, 1), j(t);
      continue;
    }
    const i = Ht(t, r);
    if (["s-if", "s-html"].includes(i.name) && (i.value.content = G(i.value.content)), i.name === "s-for") {
      const s = i.value.content.split(" in ");
      i.value.content = s[0] + " in " + G(s[1]);
    }
    i.type === 6 && i.value && i.name === "class" && (i.value.content = i.value.content.replace(/\s+/g, " ").trim()), e === 0 && n.push(i), j(t);
  }
  return n;
}
function Ht(t, e) {
  const n = $(t), o = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(t.source)[0];
  e.add(o), E(t, o.length);
  let i;
  /^[\t\r\n\f ]*=/.test(t.source) && (j(t), E(t, 1), j(t), i = Wt(t));
  const s = v(t, n);
  if (!t.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(o)) {
    const l = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(o), a = b(o, "."), u = l[1] || (a || b(o, ":") ? "bind" : b(o, "@") || b(o, "s-on:") ? "on" : "slot");
    let c;
    if (l[2]) {
      const m = u === "slot", h = o.lastIndexOf(l[2], o.length - (l[3]?.length || 0)), g = v(
        t,
        ut(t, n, h),
        ut(
          t,
          n,
          h + l[2].length + (m && l[3] || "").length
        )
      );
      let p = l[2];
      p.startsWith("[") ? p.endsWith("]") ? p = p.slice(1, p.length - 1) : p = p.slice(1) : m && (p += l[3] || ""), c = {
        type: 4,
        content: p,
        loc: g
      };
    }
    if (i?.isQuoted) {
      const m = i.loc;
      m.start.offset++, m.start.column++, m.end = Ot(m.start, i.content), m.source = m.source.slice(1, -1);
    }
    const f = l[3] ? l[3].slice(1).split(".") : [];
    return a && f.push("prop"), {
      type: 7,
      name: u,
      exp: i && {
        type: 4,
        content: G(i.content),
        loc: i.loc,
        isStatic: !zt(i.content)
      },
      arg: c,
      modifiers: f,
      loc: s
    };
  }
  return {
    type: 6,
    name: o,
    value: i && {
      type: 2,
      content: i.content,
      loc: i.loc
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
  const r = t.source[0], o = r === '"' || r === "'";
  if (o) {
    E(t, 1);
    const i = t.source.indexOf(r);
    i === -1 ? n = F(t, t.source.length) : (n = F(t, i), E(t, 1));
  } else {
    const i = /^[^\t\r\n\f >]+/.exec(t.source);
    if (!i)
      return;
    n = F(t, i[0].length);
  }
  return {
    content: n,
    isQuoted: o,
    loc: v(t, e)
  };
}
function mt(t, e) {
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
  const r = _t(t, e);
  return e.pop(), n.children = r, At(t.source, n.tag) && J(
    t,
    1
    /* End */
  ), n.loc = v(t, n.loc.start), n;
}
function J(t, e, n) {
  const r = $(t), o = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(t.source), i = o[1];
  E(t, o[0].length), j(t);
  const s = Dt(t, e);
  let l = !1;
  if (t.source.length !== 0 && (l = b(t.source, "/>"), E(t, l ? 2 : 1)), e === 1) {
    wt();
    return;
  }
  return {
    type: 1,
    tag: i,
    tagType: 0,
    children: [],
    props: s,
    isSelfClosing: l,
    loc: v(t, r)
  };
}
var bt = /* @__PURE__ */ ((t) => (t[t.HTML = 0] = "HTML", t))(bt || {});
function gt(t) {
  const e = $(t), n = t.source[1] === "?" ? 1 : 2;
  let r;
  const o = t.source.indexOf("-->") + 2;
  return o === -1 ? (r = t.source.slice(n), E(t, t.source.length)) : (r = t.source.slice(n, o), E(t, o + 1)), {
    type: 3,
    content: r,
    loc: v(t, e)
  };
}
function qt(t, e) {
  const n = t.source;
  if (b(n, "</")) {
    for (let r = e.length - 1; r >= 0; --r)
      if (At(n, e[r].tag))
        return !0;
  }
  return !n;
}
function Kt(t) {
  const [e, n] = t.options.delimiters, r = t.source.indexOf(n, e.length), o = $(t);
  E(t, e.length);
  const i = $(t), s = $(t), l = r - e.length, a = t.source.slice(0, l), u = Zt(t, l), c = u.trim(), f = u.indexOf(c);
  f > 0 && C(i, a, f);
  const m = l - (u.length - c.length - f);
  return C(s, a, m), E(t, n.length), {
    type: 5,
    content: {
      type: 4,
      content: G(c),
      loc: v(t, i, s)
    },
    loc: v(t, o)
  };
}
function Qt(t) {
  const e = ["<", t.options.delimiters[0]];
  let n = t.source.length;
  for (let i = 0; i < e.length; i++) {
    const s = t.source.indexOf(e[i], 1);
    s !== -1 && n > s && (n = s);
  }
  const r = $(t);
  return {
    type: 2,
    content: F(t, n),
    loc: v(t, r)
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
  let r = 0, o = -1;
  for (let i = 0; i < n; i++)
    e.charCodeAt(i) === 10 && (r++, o = i);
  return t.offset += n, t.line += r, t.column = o === -1 ? t.column + n : n - o, t;
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
  const { column: e, line: n, offset: r } = t;
  return {
    column: e,
    line: n,
    offset: r
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
  return t.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (e, n, r, o) => {
    const i = o.slice(0, r), s = /'[^']*$/.test(i) && /[^']*'/.test(o.slice(r)), l = /"[^"]*$/.test(i) && /[^"]*"/.test(o.slice(r)), a = /`[^`]*$/.test(i) && /[^`]*`/.test(o.slice(r));
    if (s || l || a) return e;
    const u = o[r - 1];
    return u === "." || u === ":" || Yt(n) || Jt.has(n) ? e : `_ctx_.${n}`;
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
  return t.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(n, r) {
    return e[r];
  }).replace(/<[^>]+s-on:([^>]+)>/gi, function(n, r) {
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
    const i = /* @__PURE__ */ new Set();
    for (const s of t)
      i.add(I(s), e);
    return i;
  }
  if (O.Map(t)) {
    const i = /* @__PURE__ */ new Map();
    for (const s of t) i.set(I(s[0], e), I(s[1], e));
    return i;
  }
  if (e.has(t)) return e.get(t);
  if (O.Array(t)) {
    const i = [];
    for (const s in t) i[s] = I(t[s], e);
    return i;
  }
  if (!O.Object(t)) return t;
  const r = O.Array(t) ? [] : {};
  e.set(t, r);
  for (const i in t)
    O.Array(t[i]) && I(t[i], e), e.set(t, r), r[i] = I(t[i], e);
  const o = Object.getOwnPropertySymbols(t);
  for (const i of o)
    r[i] = I(t[i], e);
  return r;
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
function V(t, e) {
  function n(r) {
    r.props?.forEach((i) => {
      i.name === "s-if" && e.sIf(r, i), i.name === "s-for" && e.sFor(r, i), i.name === "s-html" && e.sHtml(r, i), i.name === "s-model" && e.sModel(r, i), i.name === "s-loading" && e.sLoading(r, i);
    }), r.tag === "slot" && (r.type = A.SLOT), r.children && r.children.forEach((i) => {
      n(i);
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
  const e = (i = []) => {
    let s = "[";
    return i.forEach((l, a) => {
      l.type === A.ELEMENT || l.type === A.INTERPOLATION || l.type === A.SLOT ? s += n(l) + `${a === i.length - 1 ? "" : ","}` : l.type === A.TEXT && l.content.trim() && (s += n(l) + `${a === i.length - 1 ? "" : ","}`);
    }), s + "]";
  };
  function n(i) {
    let s = "";
    const l = i.props;
    if (i.type === 1 || i.type === A.SLOT) {
      let a = "", u = !1;
      if (a += `_ctx_._SUGAR._c('${i.tag}',{ `, a += '"attrs":{', a += X(l), a += '},"on":{', a += q(l), a += "}},", i.children ? a += e(i.children) : a += "[]", a += ")", i.forStatment && (u = !0, s += o(i)), i.if && !i.forStatment && (u = !0, s = `${i.if.value} ? ${s + a} : _ctx_._SUGAR._e()`), i.loading && !i.forStatment) {
        u = !0;
        const c = B(
          V(
            Y(`<div class="s-loading" s-if="${i.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            {
              sIf: tt
            }
          )
        );
        s = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${s + (i.if ? "" : a)},${c}])`;
      }
      i.htmlStatment && (u = !0, s = `_ctx_._SUGAR._c('div',{attrs:{${X(l)}},on:{${q(l)}}},[_ctx_._SUGAR._html(${i.htmlStatment.value.content})])`), u || (s += a);
    } else i.type === A.INTERPOLATION ? s += `_ctx_._SUGAR._v(_ctx_._SUGAR._s(${i.content.content}))` : i.type === A.TEXT && (s += `_ctx_._SUGAR._v(decodeURIComponent("${encodeURIComponent(i.content)}"))`);
    return s;
  }
  return n(t);
  function r(i, s, l) {
    let a = `_ctx_._SUGAR._c('${i}',{`;
    return a += '"attrs":{', a += X(s), a += '},"on":{', a += q(s), a += "}},[", l.forEach((u, c) => {
      a += B(u), c < l.length - 1 && (a += ",");
    }), a += "])", s.forEach((u) => {
      if (u.name === "s-if" && (a = `${u.value.content} ? ${a} : _ctx_._SUGAR._e()`), u.name === "s-loading" && u.value) {
        const c = B(
          V(
            Y(`<div class="s-loading" s-if="${u.value.content}">
          <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            { sIf: tt }
          )
        );
        a = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${a},${c}])`;
      }
    }), a;
  }
  function o(i) {
    const s = i.forStatment, l = r(i.tag, i.props, i.children);
    return `..._ctx_._SUGAR._loop((${s.item}${s.index ? "," + s.index : ""})=>{
      return ${l}
    },${s.exp})`;
  }
}
function X(t) {
  let e = "";
  return t = t.filter((n) => n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "s-loading" && n.name !== "s-html"), t.forEach((n, r) => {
    n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && n.name !== "bind" && n.name !== "slot" && n.name !== "s-html" ? e += `"${n.name}":"${n.value.content}"` : n.name === "bind" ? e += `"${n.arg.content}":${n.exp.content}` : n.name === "slot" && (e += `"slot":"${n.arg.content}"`), n.name !== "s-if" && n.name !== "s-for" && n.name !== "on" && r < t.length - 1 && (e += ",");
  }), e;
}
function q(t) {
  let e = "";
  return t = t.filter((n) => n.name === "on"), t.forEach((n, r) => {
    if (n.name === "on") {
      let o = `${n.exp.content}`;
      n.exp.isStatic && (o = `(e)=>{${n.exp.content}}`), e += `"${n.arg.content}":{"value":${o},"isStatic":${n.exp.isStatic},"modifiers":[${ne(n.modifiers)}]}`, n.name === "on" && r < t.length - 1 && (e += ",");
    }
  }), e;
}
function ne(t) {
  return R(t) ? t.map((e) => `"${e}"`) : "";
}
function re(t, e) {
  const n = e.value.content.split(" in "), r = new RegExp("(?<=\\()(.+?)(?=\\))");
  n[0] = n[0].match(r) ? n[0].match(r)[0].split(",") : n[0], t.forStatment = {
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
  function e(r = "") {
    const { code: o, root: i } = ae(r);
    return {
      code: n(o),
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
    return await new Promise((n, r) => {
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
  let r = n.get(e);
  r || (r = /* @__PURE__ */ new Set(), n.set(e, r)), r.add(z);
}
function Pt(t, e) {
  const n = rt.get(t);
  if (!n) return;
  const r = n.get(e);
  if (r)
    for (const o of r)
      ue(o);
}
function me(t, e) {
  let n;
  typeof t == "function" ? n = t : kt(t) ? n = () => t.value : n = () => it(t);
  let r;
  function o() {
    const i = n();
    e(i, r), r = i;
  }
  at(o);
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
function ge(t) {
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
    get(e, n, r) {
      const o = Reflect.get(e, n, r);
      return xt(e, n), typeof o == "object" && o !== null ? ft(o) : o;
    },
    set(e, n, r, o) {
      const i = e[n], s = Reflect.set(e, n, r, o);
      return i !== r && Pt(e, n), s;
    }
  });
}
function de(t) {
  return t || {};
}
function pt(t, e) {
  const {
    data: { attrs: n, on: r },
    children: o
  } = t, i = I(e), s = ft({}), l = o;
  if (Object.keys(n).forEach((u) => {
    u !== "ref" && (s[u] = n[u]);
  }), Object.keys(r).forEach((u) => {
    r[u].parameters ? s[u] = function() {
      r[u].value(...r[u].parameters);
    } : s[u] = r[u].value;
  }), t.key && ht(t.key))
    return ht(t.key);
  const a = he({
    ...i,
    props: s,
    slot: l
  });
  return a.mount(), t.key && fe(a, t.key), a;
}
function he(t) {
  const e = vt();
  Et(e);
  const n = t.bulk(t.props), { mounted: r, update: o } = pe(), i = {}, s = {
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
    use: c
  };
  R(s.components) && (s.components = s.components.reduce((f, m) => (f[m.name] = m, f), {})), Object.values(n).forEach((f) => {
    f.headTag && f.render && f.name && f.bulk && c(f);
  });
  function l() {
    r(s, n), k[e]?.forEach((f) => {
      f.fun(), f.used = !0;
    }), at(() => {
      o(s);
    });
  }
  function a() {
    o(s);
  }
  function u(f) {
    s.slot = f, o(s);
  }
  function c(f) {
    R(f) || (f = [f]), f.forEach((m) => {
      m.name ? (s.components[m.name] = m, s.components[m.name].components = s.components) : m.fun && (i[m.fun] = m.bulk);
    });
  }
  return {
    vm: s,
    mount: l,
    ...n,
    updateSlot: u,
    forceUpdate: a,
    use: c,
    $: i
  };
}
function pe() {
  let t = null;
  function e(s, l) {
    s.$el = document.createElement(s.headTag), s._vnode = s.$el, t = s.render, Mt(s, l), s.forceUpdate = function() {
      n(s);
    };
  }
  function n(s) {
    const l = st(s), a = t.call(st(s));
    s.slot.length && r(a, s.slot), jt(l, a), l._vnode = a;
  }
  function r(s, l) {
    for (let a = 0; a < s.children.length; a++) {
      const u = s.children[a];
      if (u.tag === "slot" && o(l) && u.data.attrs?.name === "default")
        s.children.splice(0, 1, ...l);
      else if (u.tag === "slot" && u.data.attrs?.name) {
        const c = l.find((f) => f.data?.attrs.slot === u.data.attrs.name);
        i(u, c, s.children);
      } else u.children?.length && r(u, l);
    }
  }
  function o(s) {
    return !s.find((l) => !!l.data?.attrs.slot);
  }
  function i(s, l, a) {
    if (!l) {
      a.splice(a.indexOf(s), 1, []);
      return;
    }
    a.splice(a.indexOf(s), 1, ...l.children);
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
  n.elm || (n = Ee(n)), x(n, e) ? i(e, n) : n.elm?.parentNode && e ? (P.insert(
    r(e),
    P.parentNode(n.elm),
    n.elm
  ), P.remove(n.elm)) : i(e, n);
  function r(c) {
    let f;
    if (c.tag) {
      if (typeof c.tag == "string" && !K(c, t.components)) {
        if (c.tag === "component" && c.data.attrs.is) {
          const d = pt(c, c.data.attrs.is);
          c.elm = d.vm.$el, c._sugar = d, f = c.elm, c.data.attrs.ref && c.data.attrs.ref in t && (t[c.data.attrs.ref] = d);
        } else c.tag === "svg" || c.tag === "path" ? f = document.createElementNS("http://www.w3.org/2000/svg", c.tag) : f = document.createElement(c.tag);
        const { data: m = {} } = c || {}, { attrs: h = {}, on: g = {} } = m;
        for (const d in h)
          if (Object.hasOwnProperty.call(h, d)) {
            const y = h[d];
            f.setAttribute(d, y), d === "ref" && y in t && (t[y] = f);
          }
        const p = f._vei || (f._vei = {});
        for (const d in g)
          if (Object.hasOwnProperty.call(g, d) && g[d].value) {
            const y = (_) => {
              g[d].value(_), g[d].modifiers.includes("stop") && _.stopPropagation(), g[d].modifiers.includes("prevent") && _.preventDefault();
            };
            f.addEventListener(d, y), p[d] = y;
          }
        if (c.children)
          for (let d = 0; d < c.children.length; d++) {
            const y = r(c.children[d]);
            y && f.append(y);
          }
      } else if (K(c, t.components)) {
        const m = pt(c, t.components[o(c, t)]);
        c.elm = m.vm.$el, c._sugar = m, f = c.elm, c.data.attrs.ref && c.data.attrs.ref in t && (t[c.data.attrs.ref] = m);
      }
    } else c.text !== void 0 ? f = document.createTextNode(c.text) : c.elm !== void 0 && (f = c.elm);
    return c.elm = f, f;
  }
  function o(c, f) {
    return c.tag === "component" ? (f.use(c.data.attrs.is), c.data.attrs.is.name) : c.tag;
  }
  function i(c, f) {
    if (K(c, t.components)) {
      if (f._sugar)
        Se(c, f), Lt(c, t);
      else {
        const m = r(c);
        P.insert(m, P.parentNode(f.elm), f.elm), f.elm.remove(), f.elm = m;
      }
      return;
    }
    if (c.elm = f.elm, c.text !== void 0)
      f.text !== c.text && (f.elm.nodeValue = c.text);
    else if (c.tag) {
      if (s(c, f, t), f.children?.length)
        a(f.elm, f.children, c.children);
      else if (c.children.length > 0) {
        f.elm.innerHTML = "";
        for (let m = 0; m < c.children.length; m++) {
          const h = r(c.children[m]);
          h && f.elm.appendChild(h);
        }
      }
    }
  }
  function s(c, f, m) {
    const h = c.data.attrs, g = c.data.on, p = f.data.attrs, d = c.elm;
    l(d, p, h, m), _e(d, g);
  }
  function l(c, f, m, h) {
    f && Object.keys(f).forEach((g) => {
      m[g] !== f[g] && c.removeAttribute(g);
    }), Object.keys(m).forEach((g) => {
      g === "value" && (c.value = m[g]), (!f || m[g] !== f[g]) && c.setAttribute(g, m[g]), g === "ref" && m[g] in h && (h[m[g]] = c);
    });
  }
  function a(c, f, m) {
    f = yt(f), m = yt(m);
    let h = 0, g = f.length - 1, p = 0, d = m.length - 1, y = f[h], _ = f[g], S = m[p], T = m[d], w, L, M, D;
    for (; h <= g && p <= d; )
      !y || !f[h] ? y = f[++h] : !_ || !f[g] ? _ = f[--g] : !S || !m[p] ? S = m[++p] : !T || !m[d] ? T = m[--d] : x(S, y) ? (i(S, y), y = f[++h], S = m[++p]) : x(S, _) ? (i(S, _), c.insertBefore(_.elm, y.elm), _ = f[--g], S = m[++p]) : x(T, y) ? (i(T, y), c.insertBefore(y.elm, _.elm.nextSibling), y = f[++h], T = m[--d]) : x(T, _) ? (i(T, _), _ = f[--g], T = m[--d]) : (W(w) && (w = u(f, h, g)), L = dt(S.key) ? w[S.key] : null, W(L) ? (c.insertBefore(r(S), y.elm), S = m[++p]) : (M = f[L], x(M, S) ? (i(S, M), f[L] = void 0, c.insertBefore(M.elm, y.elm)) : c.insertBefore(r(S), y.elm), S = m[++p]));
    if (h > g)
      for (D = W(m[d + 1]) ? null : m[d + 1].elm; p <= d; p++)
        D ? c.insertBefore(r(m[p]), D) : c.append(r(m[p]));
    if (p > d)
      for (let U = h; U <= g; U++)
        f[U]?.elm && c.removeChild(f[U].elm);
  }
  function u(c, f, m) {
    let h, g;
    const p = {};
    for (h = f; h <= m; ++h)
      g = c[h].key, dt(g) && (p[g] = h);
    return p;
  }
}
function Se(t, e) {
  Object.keys(e._sugar.vm.props).forEach((n) => {
    const { attrs: r, on: o } = t.data;
    Object.keys(r).includes(n) ? e._sugar.vm.props[n] = t.data.attrs[n] : Object.keys(o).includes(n) && (t.data.on[n].parameters ? e._sugar.vm.props[n] = function() {
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
  Object.keys(n).forEach((r) => {
    t.removeEventListener(r, n[r]);
  }), Object.keys(e).forEach((r) => {
    n[r] = (o) => {
      e[r].modifiers.includes("stop") && o.stopPropagation(), e[r].modifiers.includes("prevent") && o.preventDefault(), e[r].value(o);
    }, t.addEventListener(r, n[r]);
  });
}
function yt(t) {
  return t.filter((e) => e.tag || e.text === "" || e.text || e.elm);
}
function Lt(t, e) {
  const n = t.data;
  if (n) {
    const r = n.attrs;
    r.ref && e[r.ref] in e && (e[r.ref] = t.elm);
  }
  t.children && t.children.forEach((r) => {
    Lt(r, e);
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
  constructor(e, n, r, o) {
    this.tag = e, this.data = n, this.children = r, this.key = n.attrs?.key, this.elm = o, this.context = void 0, this.text = void 0;
  }
};
function Oe() {
  let t = null;
  function e(r, o) {
    const i = new XMLSerializer();
    if (r.render)
      t = r.render;
    else {
      const s = r.render ? r.render : te(i.serializeToString(r.$el)), { code: l } = Tt(s);
      t = l;
    }
    Mt(r, o), at(() => {
      n(r);
    });
  }
  function n(r) {
    const o = st(r), i = t?.call(o);
    jt(o, i), o._vnode = i;
  }
  return {
    update: n,
    mounted: e
  };
}
function st(t) {
  return new Proxy(t, {
    get(e, n, r) {
      const o = Reflect.get(e, n, r);
      return St(o) ? o.value : o;
    },
    set(e, n, r, o) {
      const i = Reflect.get(e, n, o);
      return St(i) ? i.value = r : Reflect.set(e, n, r), !0;
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
  function n(a = "div", u = {}, c = []) {
    return Ut(a, u, c);
  }
  function r(a) {
    const u = new Nt();
    return u.text = a, u;
  }
  function o(a) {
    return String(a);
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
  function s(a) {
    return Ae(a);
  }
  function l(a, u) {
    const c = [];
    return u.forEach((f, m) => {
      c.push({
        ...a(f, m)
      });
    }), c;
  }
  t._SUGAR = {
    _c: n,
    _v: r,
    _s: o,
    _e: i,
    _loop: l,
    _html: s
  };
}
function Ut(t = "div", e = {}, n = []) {
  return ((o = "div", i = {}, s = []) => {
    const l = [];
    return s && s.length > 0 && s.forEach((a) => {
      l.push(a);
    }), new Nt(o, i, l);
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
  constructor(e, n, r) {
    this.tag = e, this.data = n, this.children = r, this.elm = void 0, this.context = void 0, this.text = void 0, this.key = n?.attrs?.key;
  }
}
function Ae(t) {
  function e(r) {
    const o = {
      attrs: {},
      on: {}
    };
    Array.from(r.attributes).forEach((s) => {
      o.attrs[s.name] = s.value;
    });
    const i = Ut(r.tagName, o, []);
    return Array.from(r.childNodes).forEach((s) => {
      s.nodeType === 1 ? i.children.push(e(s)) : s.nodeType === 3 && i.children.push({
        tag: "",
        content: s.textContent,
        children: [],
        elm: void 0,
        text: s.textContent,
        key: void 0,
        data: void 0
      });
    }), i;
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
  const n = t.bulk(t.props), r = {}, { mounted: o } = Oe(), i = {
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
    use: l
  };
  R(i.components) && (i.components = i.components.reduce((a, u) => (a[u.name] = u, a), {}));
  function s(a) {
    $e(), i._vnode = i.$el = typeof a == "string" ? document.querySelector(`${a}`) : a, o(i, n), Rt(() => {
      k[e]?.forEach((u) => {
        u.fun(), u.used = !0;
      });
    });
  }
  function l(a) {
    R(a) || (a = [a]), a.forEach((u) => {
      u.name ? (i.components[u.name] = u, i.components[u.name].components = i.components) : u.fun && (r[u.fun] = u.bulk);
    }), i.$el && i.forceUpdate();
  }
  return {
    vm: i,
    mount: s,
    ...n,
    use: l,
    $: r
  };
}
typeof window < "u" && (function(t) {
  t.SUGAR = {
    onMounted: Ft,
    createApp: ve,
    nextTick: Rt,
    ref: ge,
    Component: ye,
    reactive: ft,
    watch: me,
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
  ge as ref,
  Tt as sugarCompiler,
  me as watch
};
//# sourceMappingURL=sugar.es.js.map
