import { NodeTypes } from './parse';
import { isArray } from '@sugar/sugar-shared';
import { toAst } from './toAst';
import { transform } from './transform';
import { sIf } from './transform/sIf';

export function generate (ast) {
  const genElmChildren = (children = []) => {
    let str = '[';
    children.forEach((child, i) => {
      if (child.type === NodeTypes.ELEMENT || child.type === NodeTypes.INTERPOLATION || child.type === NodeTypes.SLOT) {
        str += getElm(child) + `${i === children.length - 1 ? '' : ','}`;
      } else if (child.type === NodeTypes.TEXT && !!child.content.trim()) {
        str += getElm(child) + `${i === children.length - 1 ? '' : ','}`;
      }
    });
    return str + ']';
  };

  function getElm (ast) {
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
        const loadingRender = generate(transform(toAst(`<div class="s-loading" s-if="${ast.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`), {
          sIf
        }));
        str = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${str + (!ast.if ? elStr : '')},${loadingRender}])`;
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

  function transformFor (ast) {
    const forStatment = ast.forStatment;
    const props = ast.props;
    let son = `_ctx_._SUGAR._c('${ast.tag}',{ `;

    son += '"attrs":{';

    son += dealAttr(props);

    son += '},"on":{';

    son += dealEvent(props);

    son += '}},[';

    ast.children.forEach((astChild, index) => {
      son += generate(astChild);

      if (index < ast.children.length - 1) {
        son += ',';
      } else {
        son += '])';
      }
    });

    if (ast.children.length === 0) {
      son += '])';
    }

    props.forEach((prop) => {
      if (prop.name === 's-if') {
        son = `${prop.value.content} ? ${son} : _ctx_._SUGAR._e()`;
      }

      if (prop.name === 's-loading') {
        const loadingRender = generate(transform(toAst(`<div class="s-loading" s-if="${ast.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`), {
          sIf
        }));
        son = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${son},${loadingRender}])`;
      }
    });

    return `..._ctx_._SUGAR._loop((${forStatment.item}${forStatment.index ? ',' + forStatment.index : ''})=>{
        return ${son}
                            },${forStatment.exp})`;
  }
}

function dealAttr (props) {
  let str = '';

  props = props.filter(prop => {
    return prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && prop.name !== 's-loading' && prop.name !== 's-html';
  });

  props.forEach((prop, index) => {
    if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && prop.name !== 'bind' && prop.name !== 'slot' && prop.name !== 's-html') {
      str += `"${prop.name}":"${prop.value.content}"`;
    } else if (prop.name === 'bind') {
      str += `"${prop.arg.content}":${prop.exp.content}`;
    } else if (prop.name === 'slot') {
      str += `"slot":"${prop.arg.content}"`;
    }

    if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && index < props.length - 1) {
      str += ',';
    }
  });

  return str;
}

function dealEvent (props) {
  let str = '';

  props = props.filter(prop => {
    return prop.name === 'on';
  });

  props.forEach((prop, index) => {
    if (prop.name === 'on') {
      let funString = `_ctx_.${prop.exp.content}`;

      if (prop.exp.isStatic) {
        funString = `(e)=>{${prop.exp.content}}`;
      }

      str += `"${prop.arg.content}":{"value":${funString},"isStatic":${prop.exp.isStatic}${prop.exp.parameters ? `,"parameters":[${prop.exp.parameters}]` : ''},"modifiers":[${Array2String(prop.modifiers)}]}`;

      if (prop.name === 'on' && index < props.length - 1) {
        str += ',';
      }
    }
  });

  return str;
}

function Array2String (arr) {
  if (!isArray(arr)) {
    return '';
  }
  return arr.map((a: any) => {
    return `"${a}"`;
  });
}
