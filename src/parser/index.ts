import parse from "./parse";
import {Options} from "../eums";
import {mountHandleList} from "../hooks/onMounted";
import installComponent from "../component";

export function installSugar(options: Options = {
    el: document.body,
    components: []
}) {

    options.components.forEach(c => {
        installComponent(c);
    })

    parse(options.el);
    document.body.setAttribute('s-load', "true")
    mountHandleList.map(m => {
        m();
    })
}