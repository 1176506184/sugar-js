!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Sugar={})}(this,function(e){"use strict";const{useEffect:g,useState:v}=SUGAR,t={name:"sugar-dialog",render:`<div>
        <div class="sugar-dialog-mode" :style="style" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close" :style="'transform:' + transform">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,bulk(e){var t;const[a,s]=v(!1),[l,n]=v(0),i=null!=(t=null==(t=e.direction)?void 0:t.value)?t:"center",[r,o]=v(""),[c,u]=v(d(i));function d(e,t=!1){return"center"!==e&&"top"===e?t?"translateY(0)":"translateY(-100%)":""}return g(()=>{e.model.value?(s(!0),setTimeout(()=>{n(1)},50)):(n(0),setTimeout(()=>{e.model.value||s(!1)},300)),o(`opacity:${l.value};`),a.value?setTimeout(()=>{u(d(i,a.value))},50):u(d(i,a.value))},[e.model,l,a],!0),{show:a,close:function(){e.close()},opacity:l,style:r,transform:c}}},l=SUGAR["useState"];var a={name:"sugar-button",render:`<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,bulk(t){const[a,s]=l(0);return{click:function(){var e;s(a.value+1),null!=(e=t.click)&&e.call(t)},ctx:t,text:a}}};const s=SUGAR["useState"];var n={name:"sugar-image",render:`<div class="sugar-image-container">
                <img :src="ctx.src"/>
          </div>`,bulk(e){var[t,,]=s("sugar-image-container");return{ctx:e,className:t}}};const{useEffect:i,useState:r,onMounted:o}=SUGAR;var c={name:"sugar-checkbox",render:`
    <div class="sugar-checkbox-container" :style="style" @click.self="click">
     <div class="sugar-checked" s-if="checked" ></div>
    </div>
  `,bulk(e){o(()=>{console.log(e)});const[t,a]=r(!1);var[s,,]=r("");return i(()=>{a(e.model.value)},[e.model],!0),{checked:t,ctx:e,style:s,click:function(){console.log(e)}}}};const{useEffect:b,useState:x}=SUGAR;var u={name:"sugar-pagination",render:`
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
  `,bulk(t){const[e,a]=x(1),[s,l]=x(20),[n,i]=x(0),[r,o]=x([1]),[c,u]=x(!1),[d,g]=x(!1),[v,h]=x(!1),[m,p]=x(!1),[,f]=x(!1);function w(){l(t.ps.value),a(t.pi.value),i(t.total.value),o(function(t,a,s){t=Number(t),a=Number(a),s=Number(s);var l=[];for(let e=1;e<=a;e++){var n=t-e;0<n&&l.unshift(n)}var i=[];for(let e=1;e<=a+(a-l.length);e++){var r=t+e;r<=s&&i.push(r)}if(i.length<a){var o=l.length;for(let e=1;e<=a-i.length;e++){var c=t-o-e;0<c&&l.unshift(c)}}return[...l,t,...i]}(e.value,t.page.value,Math.ceil(n.value/s.value))),t["show-sis"]&&f(t["show-sis"].value),1<e.value?g(!0):g(!1),e.value<Math.ceil(n.value/s.value)?u(!0):u(!1),t.btn&&h(t.btn.value),t["show-most"]&&p(t["show-most"].value),m.value&&!r.value.includes(1)&&o([1,...r.value]),m.value&&!r.value.includes(Math.ceil(n.value/s.value))&&o([...r.value,Math.ceil(n.value/s.value)])}return w(),b(()=>{w()},[t.ps,t.pi,t.total,t.btn,t.page,t["show-most"],t["show-sis"]],!0),{pi:e,setPi:a,ps:s,setPs:l,total:n,page:r,style:t.style,canNext:c,canPrev:d,changePage:function(e){t.change(e)},showBtn:v,prev:function(){1<e.value&&t.change(e.value-1)},next:function(){e.value<Math.ceil(n.value/s.value)&&t.change(e.value+1)}}}};const d={let:"transform: rotate(180deg);",right:"transform: rotate(0deg);",top:"transform: rotate(90deg);",bottom:"transform: rotate(-90deg);"},{useEffect:h,useState:m}=SUGAR;var p={name:"sugar-text",render:`<div :class="'sugar-text ' + (open ? '':'sugar-text__ellipsis')" :style="style">
                <slot name="default"></slot>
                <div s-if="arrow" class="sugar-arrow" @click="click">
                  <div :class="open ? 'open':''">
                    ${`<svg style="${d.bottom}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`}
                  </div>
                </div>
           </div>`,bulk(e){const[t,a]=m(""),[s,l]=m(!1),[n,i]=m(!1);return h(()=>{a(e.style.value),0<e.rows.value&&a(e.style.value+";"+`-webkit-line-clamp: ${e.rows.value};`),e.arrow&&l(e.arrow.value)},[e.style,e.rows,e.arrow],!0),{style:t,rows:e.rows,arrow:s,open:n,click:function(){i(!n.value)}}}};const f=SUGAR["instance"];var w={name:"sugar-upload",render:`<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" instance="fileRef" type="file"/>
           </div>`,bulk(t){const a=f();return{fileInput:function(e){t.change(e.target.files),a.value.value=""},fileRef:a,uploadFile:function(){a.value.click()}}}};const{makeSugar:k,useState:y,onMounted:S}=SUGAR;var A={fun:"showToast",bulk(e,t=2e3,a=""){let s=document.createElement("div"),l=(document.body.appendChild(s),k({render:'<div class="sugar-toast" :style="style">{{text}}</div>',bulk(){return{text:e,style:a}}}));l.mount(s),setTimeout(()=>{l=null,s.remove(),s=null},t)}},T={fun:"showMessageBox",bulk(s={title:"提示",content:"这是一条提示的内容",confirmText:"确认",cancelText:"取消",confirm:()=>{},cancel:()=>{}}){let l=document.createElement("div"),n=(document.body.appendChild(l),k({render:`<sugar-dialog :model="show" @close="cancel">
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
                </sugar-dialog>`,bulk(){var e;const[t,a]=y(!0);return S(()=>{console.log(s),a(!0)}),{title:null!=(e=s.title)?e:"提示",content:null!=(e=s.content)?e:"",show:t,cancel:function(){s.cancel(),a(!1),setTimeout(()=>{n=null,l.remove(),l=null},300)},confirm:function(){s.confirm(),a(!1),setTimeout(()=>{n=null,l.remove(),l=null},300)},confirmText:null!=(e=s.confirmText)?e:"确定",cancelText:null!=(e=s.cancelText)?e:"取消"}}}));n.install([t]),n.mount(l)}};const{useState:M,onMounted:_}=SUGAR;var L={name:"sugar-back-top",render:`<div class="sugar-back-top" @click="goTop" :style="scale">
<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M832 165.76H192c-26.24 0-48 21.76-48 48s21.76 48 48 48h640c26.24 0 48-21.76 48-48s-21.76-48-48-48zM551.04 376.96A58.688 58.688 0 0 0 512 360.32c-12.8 0-29.44 7.04-38.4 16L254.08 595.84c-18.56 18.56-18.56 49.28 0 67.84s49.28 18.56 67.84 0l142.08-142.08v348.16c0 26.24 21.76 48 48 48s48-21.76 48-48V521.6l142.08 142.08c9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08c18.56-18.56 18.56-49.28 0-67.84L551.04 376.96z" p-id="2865" fill="#ffffff"></path></svg>
</div>`,bulk(){const[e,t]=M("");return _(()=>{window.addEventListener("scroll",()=>{400<window.scrollY?t("transform:scale(1)"):t("")})}),{goTop:function(){window.scrollTo({top:0,behavior:"smooth"})},scale:e}}};const{useState:R,onMounted:E,instance:N,nextTick:U,useEffect:O}=SUGAR;var P={name:"sugar-swiper",render:`<div class="sugar-swiper" instance="swiper">
                  <div class="sugar-swiper-wrapper" :style="style">
                        <slot name="default"></slot>
                  </div>
          </div>`,bulk(){const[e,t]=R(""),s=N(),[a,l]=R(""),[n,i]=R("translateX(0)");let r=null,o=0;const[c,u]=R("transform 0.3s"),d=(E(()=>{U(()=>{l(s.value.clientWidth)}),setInterval(()=>{u("transform 0.3s"),o!==s.value.children[0].children.length-1||r?o===s.value.children[0].children.length-1?(r=g(),u("none"),o=0,i(`translateX(-${a.value*o}px)`),U(()=>{u("transform 0.3s"),o=1,i(`translateX(-${a.value*o}px)`)})):o+=1:(r=d(),o+=1,setTimeout(()=>{u("none"),o=0,i(`translateX(-${a.value*o}px)`)},300)),i(`translateX(-${a.value*o}px)`)},2e3)}),()=>{var e,t=s.value.children[0];if(0<t.children.length)return e=t.children[0].cloneNode(!0),t.appendChild(e),e}),g=()=>{var e,t,a=s.value.children[0];if(0<a.children.length)return e=a.children[0].cloneNode(!0),t=a.children[a.children.length-1],a.replaceChild(e,t),e};return O(()=>{t(`width:${a.value*s.value.children[0].children.length}px;transform:${n.value};transition: ${c.value};`)},[a,n]),{style:e,swiper:s}}};const{useState:z,onMounted:I,instance:X,nextTick:C}=SUGAR;var W={name:"sugar-swiper-item",render:`<div class="sugar-swiper-item" :style="'width:'+width" instance="swiper">
                <slot name="default"></slot>
          </div>`,bulk(){const[e,t]=z(""),a=X();return I(()=>{C(()=>{t(a.value.clientWidth+"px")})}),{width:e,swiper:a}}},$=SUGAR["useState"];const[G,j]=$({percentage:{},getPercentage:F,getLoadFinish:function(t){var a={},s=Array.from(document.querySelectorAll("#per_1 [sugar-id]"));for(let e=0;e<s.length;e++)a[s[e].getAttribute("sugar-id")]=F(s[e],t);return a}});function F(e,t){var a=e.getAttribute("sugar-wh").split(",")[0],s=e.getAttribute("sugar-wh").split(",")[1],l=e.getAttribute("sugar-tb").split(",")[0],e=e.getAttribute("sugar-tb").split(",")[1],t=document.querySelector("#"+t),n=t.getAttribute("sugar-wh").split(",")[0],t=t.getAttribute("sugar-wh").split(",")[1];return`width:${(a/n*100).toFixed(2)}%;height:${(s/t*100).toFixed(2)}%;margin-top:${(l/t*100).toFixed(2)}%;margin-bottom:${(e/t*100).toFixed(2)}%`}const{useState:Y,instance:q,onMounted:H}=SUGAR,B=[{name:"sugar-percentage",render:`<div style="width:100%;height:100%%;position:relative" :id="id" :sugar-wh="sugarWh">
            <img alt="" :src="background" style="width: 100%;height: 100%" instance="bg" :id="'bg' + id"/>
            <div style="position: absolute;top:0;left: 0;right: 0;bottom: 0"><slot name="default"></slot></div>
          </div>`,bulk(e){var[t,,]=Y(""),a=q();return G.value.percentage[e.id.value]||j(Object.assign(Object.assign({},G.value),{percentage:Object.assign(Object.assign({},G.value.percentage),{[e.id.value]:{id:e.id.value}})})),H(()=>{j(Object.assign(Object.assign({},G.value),{percentage:Object.assign(Object.assign({},G.value.percentage),{[e.id.value]:{id:e.id.value}})}))}),{style:t,background:e.background,id:e.id,bg:a,sugarWh:e["sugar-wh"]}}},t,a,n,c,u,p,w,A,{name:"sugar-message",render:"",bulk(e){return{}}},T,L,P,W];"undefined"!=typeof window&&(($=window).sugarUI=B,$.sugarStore=G,$.getLoadFinish=G.value.getLoadFinish),e.store=G,e.sugarUI=B});
//# sourceMappingURL=sugar-ui.js.map
