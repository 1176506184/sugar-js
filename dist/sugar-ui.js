!function(e,l){"object"==typeof exports&&"undefined"!=typeof module?l(exports):"function"==typeof define&&define.amd?define(["exports"],l):l((e="undefined"!=typeof globalThis?globalThis:e||self).Sugar={})}(this,function(e){"use strict";SUGAR;const{useEffect:i,useSignal:c}=SUGAR,l=[{name:"sugar-button",render:`<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,bulk(t){return{click:function(e){var l;null!=(l=t.click)&&l.call(t,e)},ctx:t}}},{name:"sugar-dialog",render:`<div>
        <div class="sugar-dialog-mode" :style="style" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close" :style="'transform:' + transform">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,bulk(e){var l;const t=c(e.model.value),o=c(0),a=null!=(l=null==(l=e.direction)?void 0:l.value)?l:"center",s=c(""),u=c(n(a));function n(e,l=!1){return"center"!==e&&"top"===e?l?"translateY(0)":"translateY(-100%)":""}return i(()=>{e.model.value?(t.value=!0,setTimeout(()=>{o.value=1,s.value=`opacity:${o.value};`,console.log(s)},50)):(o.value=0,s.value=`opacity:${o.value};`,setTimeout(()=>{e.model.value||(t.value=!1)},300)),t.value?setTimeout(()=>{u.value=n(a,t.value)},50):u.value=n(a,t.value)},[e.model],!0),{show:t,close:function(){e.close()},opacity:o,style:s,transform:u}}}];"undefined"!=typeof window&&(window.sugarUI=l),e.sugarUI=l});
//# sourceMappingURL=sugar-ui.js.map
