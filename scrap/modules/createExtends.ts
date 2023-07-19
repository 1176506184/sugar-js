import sign_enum from "./eums";
import {updateInnerText} from "./updateInnerText";
import {guid} from "../../src/utils/guid";


const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute =
    /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const unicodeRegExp =
    /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

function createExtends(template: String) {

    let sign = "";
    let str: string = template.replace(/[\r\n]/g, ' ').replace(/\n/g, "");
    let result = {nodeName: "root", children: [], text: null as any, viscus: [], guid: guid(), directive: []};
    let use_line = [0];
    let current_index = 0;
    let node = result;
    let status = "";
    let viscusArr = []
    let events = []
    let html = "";

    for (let i = 0; i < str.length; i++) {
        let current = str.charAt(i);
        let next = str.charAt(i + 1);
        if (current === '<') {
            html = current
            if (sign && status === sign_enum.SIGN_START_OK) {
                if (!node.guid) {
                    node.guid = guid();
                }

                node.text = sign;
                let viscus = []
                let directiveArr = sign.match(/{{(.+?)}}/ig);
                directiveArr?.forEach((d: string) => {
                    viscus.push(d.match(/{{(.+?)}}/)[1]);
                })
                node.viscus = viscus;
                if (node.directive["s-for"]) {
                    let sFor = node.directive["s-for"].split(' in ');
                    sFor = sFor.map(s => {
                        return s.trim()
                    })
                    if (!viscusArr[sFor[1]]) {
                        viscusArr[sFor[1]] = {}
                    }
                    viscusArr[sFor[1]][node.guid] = node;
                }

                viscus.forEach(v => {
                    if (!viscusArr[v]) {
                        viscusArr[v] = {};
                    }
                    viscusArr[v][node.guid] = node;
                })
            }


            if (next === "/") {
                status = sign_enum.SIGN_END
            } else {
                status = sign_enum.SIGN_START
            }

        } else if (current === '>') {
            if (status === sign_enum.SIGN_START) {
                html += current
                let guidStr = guid();
                node = result;


                use_line.map((_, index) => {
                    if (!node.children) node.children = [];
                    if (index === use_line.length - 1) {
                        // sign = sign.replace(/^\s*/g, "").replace(/"/g, ""); //去掉换行符
                        // let mark = sign.match(/^[a-zA-Z\d]*\s*/)[0].replace(/\s/g, "");
                        // let attributeStr = sign.replace(mark, '').replace(/\s+/g, ",").split(",");
                        let attributeObj = {
                            directive: []
                        };
                        let style = {};

                        let attr, end;
                        let attrArr = [];
                        let start = html.match(startTagOpen);
                        let mark = start[1];
                        advance(start[0].length);

                        while (!(end = html.match(startTagClose)) &&
                        (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                            attrArr.push({
                                name: attr[1],
                                value: attr[3]
                            });


                            if (attr[1] === "style") {
                                attr[3].split(";").map(s => {
                                    if (s) {
                                        style[s.split(":")[0]] = s.split(":")[1]
                                    }
                                })
                                attributeObj[attr[1]] = style;
                            } else if (attr[1] === "s-click") {
                                if (!events[guidStr]) {
                                    events[guidStr] = {};
                                }
                                events[guidStr]['s-click'] = attr[3];
                                attributeObj['directive']['s-click'] = attr[3]
                            } else if (attr[1] === "s-change") {
                                if (!events[guidStr]) {
                                    events[guidStr] = {};
                                }
                                events[guidStr]['s-change'] = attr[3];
                                attributeObj['directive']['s-change'] = attr[3]
                            } else if (attr[1] === "s-for") {
                                attributeObj['directive']['s-for'] = attr[3]
                            } else {
                                attributeObj[attr[1]] = attr[3];
                            }

                            advance(attr[0].length)
                        }

                        node.children.push({nodeName: mark, children: [], ...attributeObj, guid: guidStr})
                    }
                    current_index = node.children.length - 1;
                    node = node.children[current_index];
                })
                use_line.push(current_index);
                sign = "";
                status = sign_enum.SIGN_START_OK;
            }

            if (status === sign_enum.SIGN_END) {
                use_line.pop();
                node = result;
                use_line.map((i) => {
                    node = node?.children[i];
                });
                sign = "";
                status = sign_enum.SIGN_END_OK;
            }
        } else {
            html += current
            sign = sign + current;
        }

    }


    function advance(n) {
        html = html.substring(n);
    }

    return {extendsArr: result, viscusArr, events};
}

export {createExtends}