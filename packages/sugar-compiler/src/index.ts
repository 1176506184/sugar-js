import {isArray} from "@sugar/sugar-shared";
import {baseCompile} from "./compile";


export function sugarCompiler(template, components?: any, data?: any) {

    function compile(template = '') {
        const astEX = baseCompile(template, components, data)
        return createFunction(astEX);
    }


    function createFunction(code = '') {
        return new Function(`
            with(this) {
              return ${code};
            }
        `)
    }

    return compile(template)

}