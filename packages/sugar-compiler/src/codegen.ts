import { NodeTypes } from './parse';
import { isArray } from '@sugar/sugar-shared';
import { toAst } from './toAst';
import { transform } from './transform';
import { sIf } from './transform/sIf';

let key = 0;

export function generate(ast: any) {
  const genElmChildren = (children = []) => {
    let str = '[';
    children.forEach((child: any, i) => {
      if (
        child.type === NodeTypes.ELEMENT ||
        child.type === NodeTypes.INTERPOLATION ||
        child.type === NodeTypes.SLOT
      ) {
        str += getElm(child) + `${i === children.length - 1 ? '' : ','}`;
      } else if (child.type === NodeTypes.TEXT && !!child.content.trim()) {
        str += getElm(child) + `${i === children.length - 1 ? '' : ','}`;
      }
    });
    return str + ']';
  };

  function getElm(ast: any) {
    let str = '';
    const props = ast.props;
    if (ast.type === 1 || ast.type === NodeTypes.SLOT) {
      let elStr = '';
      let ex = false;

      elStr += `_ctx_._SUGAR._c('${ast.tag}',{ `;

      elStr += '"attrs":{';

      elStr += dealAttr(props);

      elStr += '},"on":{';

      elStr += dealEvent(props);

      elStr += '}},';

      if (ast.children) {
        elStr += genElmChildren(ast.children);
      } else {
        elStr += '[]';
      }

      elStr += ')';

      if (ast.forStatment) {
        ex = true;
        str += transformFor(ast);
      }

      if (ast.if && !ast.forStatment) {
        ex = true;
        str = `${ast.if.value} ? ${str + elStr} : _ctx_._SUGAR._e()`;
      }

      if (ast.loading && !ast.forStatment) {
        ex = true;
        const loadingRender = generate(
          transform(
            toAst(`<div class="s-loading" s-if="${ast.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            {
              sIf,
            },
          ),
        );
        str = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${
          str + (!ast.if ? elStr : '')
        },${loadingRender}])`;
      }

      if (ast.htmlStatment) {
        ex = true;
        str = `_ctx_._SUGAR._c('div',{attrs:{${dealAttr(props)}},on:{${dealEvent(props)}}},[_ctx_._SUGAR._html(${ast.htmlStatment.value.content})])`;
      }

      if (!ex) {
        str += elStr;
      }
    } else if (ast.type === NodeTypes.INTERPOLATION) {
      str += `_ctx_._SUGAR._v(_ctx_._SUGAR._s(${ast.content.content}))`;
    } else if (ast.type === NodeTypes.TEXT) {
      str += `_ctx_._SUGAR._v(decodeURIComponent("${encodeURIComponent(ast.content)}"))`;
    }

    return str;
  }

  return getElm(ast);

  function createElementString(tag: any, props: any, children: any) {
    let element = `_ctx_._SUGAR._c('${tag}',{`;
    element += '"attrs":{';
    element += dealAttr(props);
    element += '},"on":{';
    element += dealEvent(props);
    element += '}},[';

    children.forEach((child: any, index: any) => {
      element += generate(child);
      if (index < children.length - 1) {
        element += ',';
      }
    });

    element += '])';

    // Handle s-if and s-loading directives
    props.forEach((prop: any) => {
      if (prop.name === 's-if') {
        element = `${prop.value.content} ? ${element} : _ctx_._SUGAR._e()`;
      }

      if (prop.name === 's-loading' && prop.value) {
        const loadingRender = generate(
          transform(
            toAst(`<div class="s-loading" s-if="${prop.value.content}">
          <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`),
            { sIf },
          ),
        );
        element = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${element},${loadingRender}])`;
      }
    });

    return element;
  }

  function transformFor(ast: any) {
    const forStatment = ast.forStatment;
    const elementStr = createElementString(ast.tag, ast.props, ast.children);

    return `..._ctx_._SUGAR._loop((${forStatment.item}${
      forStatment.index ? ',' + forStatment.index : ''
    })=>{
      return ${elementStr}
    },${forStatment.exp})`;
  }
}

function dealAttr(props: any) {
  let str = '';

  props = props.filter((prop: any) => {
    return (
      prop.name !== 's-if' &&
      prop.name !== 's-for' &&
      prop.name !== 'on' &&
      prop.name !== 's-loading' &&
      prop.name !== 's-html'
    );
  });
  if (!props.find((r: any) => r.name === 'key')) {
    props.push({
      name: 'key',
      value: {
        content: `_SUGAR_KEY_${key++}`,
        isStatic: true,
      },
    });
  }

  props.forEach((prop: any, index: number) => {
    if (
      prop.name !== 's-if' &&
      prop.name !== 's-for' &&
      prop.name !== 'on' &&
      prop.name !== 'bind' &&
      prop.name !== 'slot' &&
      prop.name !== 's-html'
    ) {
      str += `"${prop.name}":"${prop.value.content}"`;
    } else if (prop.name === 'bind') {
      str += `"${prop.arg.content}":${prop.exp.content}`;
    } else if (prop.name === 'slot') {
      str += `"slot":"${prop.arg.content}"`;
    }

    if (
      prop.name !== 's-if' &&
      prop.name !== 's-for' &&
      prop.name !== 'on' &&
      index < props.length - 1
    ) {
      str += ',';
    }
  });

  return str;
}

function dealEvent(props: any) {
  let str = '';

  props = props.filter((prop: any) => {
    return prop.name === 'on';
  });

  props.forEach((prop: any, index: number) => {
    if (prop.name === 'on') {
      let funString = `${prop.exp.content}`;
      if (prop.exp.isStatic) {
        funString = `(e)=>{${prop.exp.content}}`;
      }
      str += `"${prop.arg.content}":{"value":${funString},"isStatic":${prop.exp.isStatic},"modifiers":[${Array2String(prop.modifiers)}]}`;

      if (prop.name === 'on' && index < props.length - 1) {
        str += ',';
      }
    }
  });

  return str;
}

function Array2String(arr: any) {
  if (!isArray(arr)) {
    return '';
  }
  return arr.map((a: any) => {
    return `"${a}"`;
  });
}
