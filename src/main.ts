import {createEffect} from "./signal/createEffect";
import createSignal from "./signal/createSignal";
import {installSugar} from "./parser";
import onMounted from "./hooks/onMounted";
import installComponent from './component';
import {reactive} from "./reactive";
import makeSugar from "./core";

window['createEffect'] = createEffect
window['createSignal'] = createSignal
window['onMounted'] = onMounted
window['installSugar'] = installSugar
window['installComponent'] = installComponent
window['reactive'] = reactive
window['makeSugar'] = makeSugar
