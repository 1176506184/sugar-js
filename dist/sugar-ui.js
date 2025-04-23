!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Sugar={})}(this,function(e){"use strict";const{useEffect:v,useState:g}=SUGAR,t={name:"sugar-dialog",render:`<div>
        <div class="sugar-dialog-mode" :style="style" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close" :style="'transform:' + transform">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,bulk(e){var t;const[a,l]=g(!1),[s,n]=g(0),i=null!=(t=null==(t=e.direction)?void 0:t.value)?t:"center",[r,o]=g(""),[u,c]=g(d(i));function d(e,t=!1){return"center"!==e&&"top"===e?t?"translateY(0)":"translateY(-100%)":""}return v(()=>{e.model.value?(l(!0),setTimeout(()=>{n(1)},50)):(n(0),setTimeout(()=>{e.model.value||l(!1)},300)),o(`opacity:${s.value};`),a.value?setTimeout(()=>{c(d(i,a.value))},50):c(d(i,a.value))},[e.model,s,a],!0),{show:a,close:function(){e.close()},opacity:s,style:r,transform:u}}},s=SUGAR["useState"];var a={name:"sugar-button",render:`<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,bulk(t){const[a,l]=s(0);return{click:function(){var e;l(a.value+1),null!=(e=t.click)&&e.call(t)},ctx:t,text:a}}};const l=SUGAR["useState"];var n={name:"sugar-image",render:`<div class="sugar-image-container">
                <img :src="ctx.src"/>
          </div>`,bulk(e){var[t,,]=l("sugar-image-container");return{ctx:e,className:t}}};const{useEffect:i,useState:r,onMounted:o}=SUGAR;var u={name:"sugar-checkbox",render:`
    <div class="sugar-checkbox-container" :style="style" @click.self="click">
     <div class="sugar-checked" s-if="checked" ></div>
    </div>
  `,bulk(e){o(()=>{console.log(e)});const[t,a]=r(!1);var[l,,]=r("");return i(()=>{a(e.model.value)},[e.model],!0),{checked:t,ctx:e,style:l,click:function(){console.log(e)}}}};const{useEffect:b,useState:x}=SUGAR;var c={name:"sugar-pagination",render:`
      <div class="sugar-pagination" :style="style">
        <ul class="sugar-pagination__items">
            <li s-if="showBtn" class="sugar-pagination__item" @click="prev">
                <svg t="1741916731985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2581" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" :fill="canPrev?'#333':'#8a8a8a'"></path></svg>
            </li>
            <li @click="changePage(item)" :class="pi === item ? 'sugar-pagination__item sugar-pagination__item--active':'sugar-pagination__item'" s-for="(item,index) in page">
              <button>{{item}}</button>
            </li>
            <li s-if="showBtn" class="sugar-pagination__item right_arrow" @click="next">
                <svg t="1741916731985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2581" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" :fill="canNext?'#333':'#8a8a8a'"></path></svg>
            </li>
        </ul>
      </div>
  `,bulk(t){const[e,a]=x(1),[l,s]=x(20),[n,i]=x(0),[r,o]=x([1]),[u,c]=x(!1),[d,v]=x(!1),[g,h]=x(!1),[f,p]=x(!1),[,m]=x(!1);function w(){s(t.ps.value),a(t.pi.value),i(t.total.value),o(function(t,a,l){t=Number(t),a=Number(a),l=Number(l);var s=[];for(let e=1;e<=a;e++){var n=t-e;0<n&&s.unshift(n)}var i=[];for(let e=1;e<=a+(a-s.length);e++){var r=t+e;r<=l&&i.push(r)}if(i.length<a){var o=s.length;for(let e=1;e<=a-i.length;e++){var u=t-o-e;0<u&&s.unshift(u)}}return[...s,t,...i]}(e.value,t.page.value,Math.ceil(n.value/l.value))),t["show-sis"]&&m(t["show-sis"].value),1<e.value?v(!0):v(!1),e.value<Math.ceil(n.value/l.value)?c(!0):c(!1),t.btn&&h(t.btn.value),t["show-most"]&&p(t["show-most"].value),f.value&&!r.value.includes(1)&&o([1,...r.value]),f.value&&!r.value.includes(Math.ceil(n.value/l.value))&&o([...r.value,Math.ceil(n.value/l.value)])}return w(),b(()=>{w()},[t.ps,t.pi,t.total,t.btn,t.page,t["show-most"],t["show-sis"]],!0),{pi:e,setPi:a,ps:l,setPs:s,total:n,page:r,style:t.style,canNext:u,canPrev:d,changePage:function(e){t.change(e)},showBtn:g,prev:function(){1<e.value&&t.change(e.value-1)},next:function(){e.value<Math.ceil(n.value/l.value)&&t.change(e.value+1)}}}};const d={let:"transform: rotate(180deg);",right:"transform: rotate(0deg);",top:"transform: rotate(90deg);",bottom:"transform: rotate(-90deg);"},{useEffect:h,useState:f}=SUGAR;var p={name:"sugar-text",render:`<div :class="'sugar-text ' + (open ? '':'sugar-text__ellipsis')" :style="style">
                <slot name="default"></slot>
                <div s-if="arrow" class="sugar-arrow" @click="click">
                  <div :class="open ? 'open':''">
                    ${`<svg style="${d.bottom}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`}
                  </div>
                </div>
           </div>`,bulk(e){const[t,a]=f(""),[l,s]=f(!1),[n,i]=f(!1);return h(()=>{a(e.style.value),0<e.rows.value&&a(e.style.value+";"+`-webkit-line-clamp: ${e.rows.value};`),e.arrow&&s(e.arrow.value)},[e.style,e.rows,e.arrow],!0),{style:t,rows:e.rows,arrow:l,open:n,click:function(){i(!n.value)}}}};const m=SUGAR["instance"];var w={name:"sugar-upload",render:`<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" instance="fileRef" type="file"/>
           </div>`,bulk(t){const a=m();return{fileInput:function(e){t.change(e.target.files),a.value.value=""},fileRef:a,uploadFile:function(){a.value.click()}}}};const{makeSugar:k,useState:y,onMounted:S}=SUGAR;var A={fun:"showToast",bulk(e,t=2e3,a=""){let l=document.createElement("div"),s=(document.body.appendChild(l),k({render:'<div class="sugar-toast" :style="style">{{text}}</div>',bulk(){return{text:e,style:a}}}));s.mount(l),setTimeout(()=>{s=null,l.remove(),l=null},t)}},T={fun:"showMessageBox",bulk(l={title:"提示",content:"这是一条提示的内容",confirmText:"确认",cancelText:"取消",confirm:()=>{},cancel:()=>{}}){let s=document.createElement("div"),n=(document.body.appendChild(s),k({render:`<sugar-dialog :model="show" @close="cancel">
                    <div class="sugar-message-box">
                        <div class="sugar-message-title">
                            {{title}}
                        </div>
                        <div class="sugar-message-box-content">
                            {{content}}
                        </div>
                        <div class="sugar-message-toolbar">
                            <div class="sugar-message-box-btn" @click="cancel">{{cancelText}}</div>
                            <div class="sugar-message-box-btn sugar-message-box-confirm" @click="confirm">{{confirmText}}</div>
                        </div>
                    <div>
                </sugar-dialog>`,bulk(){var e;const[t,a]=y(!0);return S(()=>{console.log(l),a(!0)}),{title:null!=(e=l.title)?e:"提示",content:null!=(e=l.content)?e:"",show:t,cancel:function(){l.cancel(),a(!1),setTimeout(()=>{n=null,s.remove(),s=null},300)},confirm:function(){l.confirm(),a(!1),setTimeout(()=>{n=null,s.remove(),s=null},300)},confirmText:null!=(e=l.confirmText)?e:"确定",cancelText:null!=(e=l.cancelText)?e:"取消"}}}));n.install([t]),n.mount(s)}};const{useState:R,onMounted:E}=SUGAR;var N={name:"sugar-back-top",render:`<div class="sugar-back-top" @click="goTop" :style="scale">
<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M832 165.76H192c-26.24 0-48 21.76-48 48s21.76 48 48 48h640c26.24 0 48-21.76 48-48s-21.76-48-48-48zM551.04 376.96A58.688 58.688 0 0 0 512 360.32c-12.8 0-29.44 7.04-38.4 16L254.08 595.84c-18.56 18.56-18.56 49.28 0 67.84s49.28 18.56 67.84 0l142.08-142.08v348.16c0 26.24 21.76 48 48 48s48-21.76 48-48V521.6l142.08 142.08c9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08c18.56-18.56 18.56-49.28 0-67.84L551.04 376.96z" p-id="2865" fill="#ffffff"></path></svg>
</div>`,bulk(){const[e,t]=R("");return E(()=>{window.addEventListener("scroll",()=>{400<window.scrollY?t("transform:scale(1)"):t("")})}),{goTop:function(){window.scrollTo({top:0,behavior:"smooth"})},scale:e}}};const{useState:M,onMounted:O,instance:I,nextTick:L,useEffect:P}=SUGAR;var z={name:"sugar-swiper",render:`<div class="sugar-swiper" instance="swiper">
                  <div class="sugar-swiper-wrapper" :style="style">
                        <slot name="default"></slot>
                  </div>
          </div>`,bulk(){const[e,t]=M(""),l=I(),[a,s]=M(""),[n,i]=M("translateX(0)");let r=null,o=0;const[u,c]=M("transform 0.3s"),d=(O(()=>{L(()=>{s(l.value.clientWidth)}),setInterval(()=>{c("transform 0.3s"),o!==l.value.children[0].children.length-1||r?o===l.value.children[0].children.length-1?(r=v(),c("none"),o=0,i(`translateX(-${a.value*o}px)`),L(()=>{c("transform 0.3s"),o=1,i(`translateX(-${a.value*o}px)`)})):o+=1:(r=d(),o+=1,setTimeout(()=>{c("none"),o=0,i(`translateX(-${a.value*o}px)`)},300)),i(`translateX(-${a.value*o}px)`)},2e3)}),()=>{var e,t=l.value.children[0];if(0<t.children.length)return e=t.children[0].cloneNode(!0),t.appendChild(e),e}),v=()=>{var e,t,a=l.value.children[0];if(0<a.children.length)return e=a.children[0].cloneNode(!0),t=a.children[a.children.length-1],a.replaceChild(e,t),e};return P(()=>{t(`width:${a.value*l.value.children[0].children.length}px;transform:${n.value};transition: ${u.value};`)},[a,n]),{style:e,swiper:l}}};const{useState:C,onMounted:X,instance:W,nextTick:Y}=SUGAR;var q={name:"sugar-swiper-item",render:`<div class="sugar-swiper-item" :style="'width:'+width" instance="swiper">
                <slot name="default"></slot>
          </div>`,bulk(){const[e,t]=C(""),a=W();return X(()=>{Y(()=>{t(a.value.clientWidth+"px")})}),{width:e,swiper:a}}},U=SUGAR["useState"];const[_,G]=U({percentage:{},getPercentage:$,getLoadFinish:function(t){var a={},l=Array.from(document.querySelectorAll("#per_1 [sugar-id]"));for(let e=0;e<l.length;e++)a[l[e].getAttribute("sugar-id")]=$(l[e],t);return a}});function $(e,t){var a=e.getAttribute("sugar-wh").split(",")[0],l=e.getAttribute("sugar-wh").split(",")[1],s=e.getAttribute("sugar-tb").split(",")[0],e=e.getAttribute("sugar-tb").split(",")[1],t=document.querySelector("#"+t),n=t.getAttribute("sugar-wh").split(",")[0],t=t.getAttribute("sugar-wh").split(",")[1];return`width:${(a/n*100).toFixed(2)}%;height:${(l/t*100).toFixed(2)}%;margin-top:${(s/t*100).toFixed(2)}%;margin-bottom:${(e/t*100).toFixed(2)}%`}const{useState:H,instance:V,onMounted:D}=SUGAR,{useState:J,onMounted:K,instance:Q}=SUGAR,{useState:F,onMounted:Z,instance:j}=SUGAR,B=[{name:"sugar-field",render:`<div class="sugar-field">
            <slot name="label" instance="labelRef"></slot>
            <div class="sugar-field-label" s-if="showLabel">{{label}}</div>
            <slot name="default" instance="defaultRef"></slot>
            <input class="sugar-field-input" s-if="showField" :placeholder="placeholder" @input="onInput" :value="value"/>
          </div>`,bulk(t){var e,a=(null==(a=t.label)?void 0:a.value)||"文本",l=(null==(l=t.placeholder)?void 0:l.value)||"请输入";const s=j(),n=j(),[i,r]=F(!0),[o,u]=F(!0),[c,d]=F((null==(e=t.value)?void 0:e.value)||"");return Z(()=>{var e;0<(null==(e=s.value)?void 0:e.children.length)&&r(!1),0<(null==(e=n.value)?void 0:e.children.length)&&u(!1)}),{label:a,labelRef:s,showLabel:i,defaultRef:n,placeholder:l,showField:o,input:t.input,value:c,onInput:function(e){d(e.target.value),t.input(e.target.value)}}}},{name:"sugar-lazy",render:`<div instance="node">
                 <slot name="default" s-if="show" ></slot>
           </div>`,bulk(e){const[t,a]=J(!1),l=Q();return K(()=>{window.addEventListener("scroll",()=>{l.value.getBoundingClientRect().top<window.innerHeight&&a(!0)})}),{show:t,node:l}}},{name:"sugar-percentage",render:`<div style="width:100%;height:100%%;position:relative" :id="id" :sugar-wh="sugarWh">
            <img alt="" :src="background" style="width: 100%;height: 100%" instance="bg" :id="'bg' + id"/>
            <div style="position: absolute;top:0;left: 0;right: 0;bottom: 0"><slot name="default"></slot></div>
          </div>`,bulk(e){var[t,,]=H(""),a=V();return _.value.percentage[e.id.value]||G(Object.assign(Object.assign({},_.value),{percentage:Object.assign(Object.assign({},_.value.percentage),{[e.id.value]:{id:e.id.value}})})),D(()=>{G(Object.assign(Object.assign({},_.value),{percentage:Object.assign(Object.assign({},_.value.percentage),{[e.id.value]:{id:e.id.value}})}))}),{style:t,background:e.background,id:e.id,bg:a,sugarWh:e["sugar-wh"]}}},t,a,n,u,c,p,w,A,{name:"sugar-message",render:"",bulk(e){return{}}},T,N,z,q];"undefined"!=typeof window&&((U=window).sugarUI=B,U.sugarStore=_,U.getLoadFinish=_.value.getLoadFinish),e.store=_,e.sugarUI=B});
//# sourceMappingURL=sugar-ui.js.map
