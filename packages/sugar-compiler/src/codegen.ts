import { NodeTypes } from './parse';

export function generate (ast) {
  const cid = 1;

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

      elStr += `_c('${ast.tag}',{ `;

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
        str = `${ast.if.value} ? ${str + elStr} : _e()`;
      }

      if (!ex) {
        str += elStr;
      }
    } else if (ast.type === NodeTypes.INTERPOLATION) {
      str += `_v(_s(${ast.content.content}))`;
    } else if (ast.type === NodeTypes.TEXT) {
      str += `_v('${ast.content}')`;
    }

    return str;
  }

  return getElm(ast);

  function transformFor (ast) {
    const forStatment = ast.forStatment;
    const props = ast.props;
    let son = `_c('${ast.tag}',{ `;

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
        son = `${prop.value.content} ? ${son} : _e()`;
      }
    });

    return `..._loop((${forStatment.item}${forStatment.index ? ',' + forStatment.index : ''})=>{
        return ${son}
                            },${forStatment.exp})`;
  }
}

function dealAttr (props) {
  let str = '';

  props = props.filter(prop => {
    return prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on';
  });

  props.forEach((prop, index) => {
    if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && prop.name !== 'bind' && prop.name !== 'slot') {
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
      let funString = `"${prop.exp.content}"`;

      if (prop.exp.isStatic) {
        funString = `(e)=>{${prop.exp.content}}`;
      }

      str += `"${prop.arg.content}":{"value":${funString},"isStatic":${prop.exp.isStatic}${prop.exp.parameters ? `,"parameters":[${prop.exp.parameters}]` : ''}}`;

      if (prop.name === 'on' && index < props.length - 1) {
        str += ',';
      }
    }
  });

  return str;
}
