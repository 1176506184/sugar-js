!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Sugar={})}(this,function(e){"use strict";const{useEffect:n,useState:i}=SUGAR,t={name:"sugar-dialog",render:`<div>
        <div class="sugar-dialog-mode" :style="'opacity:'+opacity" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,bulk(e){const[t,l]=i(!1),[s,a]=i(0);return n(()=>{e.model.value?(l(!0),setTimeout(()=>{a(1)},50)):(a(0),setTimeout(()=>{e.model.value||l(!1)},300))},[e.model],!0),{show:t,close:function(){e.close()},opacity:s}}},a=SUGAR["useState"];const l=SUGAR["useState"],{useEffect:o,useState:c,onMounted:r}=SUGAR,{useEffect:w,useState:x}=SUGAR;const s={let:"transform: rotate(180deg);",right:"transform: rotate(0deg);",top:"transform: rotate(90deg);",bottom:"transform: rotate(-90deg);"},{useEffect:u,useState:d}=SUGAR;var v={name:"sugar-text",render:`<div :class="'sugar-text ' + (open ? '':'sugar-text__ellipsis')" :style="style">
                <slot name="default"></slot>
                <div s-if="arrow" class="sugar-arrow" @click="click">
                  <div :class="open ? 'open':''">
                    ${`<svg style="${s.bottom}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`}
                  </div>
                </div>
           </div>`,bulk(e){const[t,l]=d(""),[s,a]=d(!1),[n,i]=d(!1);return u(()=>{l(e.style.value),0<e.rows.value&&l(e.style.value+";"+`-webkit-line-clamp: ${e.rows.value};`),e.arrow&&a(e.arrow.value)},[e.style,e.rows,e.arrow],!0),{style:t,rows:e.rows,arrow:s,open:n,click:function(){i(!n.value)}}}};const g=SUGAR["instance"],{makeSugar:m,useState:h,onMounted:f}=SUGAR;const{useState:p,onMounted:b}=SUGAR,{useState:k,onMounted:y,instance:S,nextTick:T,useEffect:M}=SUGAR,{useState:_,onMounted:R,instance:U,nextTick:A}=SUGAR,L=[t,{name:"sugar-button",render:`<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,bulk(t){const[l,s]=a(0);return{click:function(){var e;s(l.value+1),null!=(e=t.click)&&e.call(t)},ctx:t,text:l}}},{name:"sugar-image",render:`<div class="sugar-image-container">
                <img :src="ctx.src"/>
          </div>`,bulk(e){var[t,,]=l("sugar-image-container");return{ctx:e,className:t}}},{name:"sugar-checkbox",render:`
    <div class="sugar-checkbox-container" :style="style" @click.self="click">
     <div class="sugar-checked" s-if="checked" ></div>
    </div>
  `,bulk(e){r(()=>{console.log(e)});const[t,l]=c(!1);var[s,,]=c("");return o(()=>{l(e.model.value)},[e.model],!0),{checked:t,ctx:e,style:s,click:function(){console.log(e)}}}},{name:"sugar-pagination",render:`
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
  `,bulk(t){const[e,l]=x(1),[s,a]=x(20),[n,i]=x(0),[o,c]=x([1]),[r,u]=x(!1),[d,v]=x(!1),[g,m]=x(!1),[h,f]=x(!1),[,p]=x(!1);return w(()=>{a(t.ps.value),l(t.pi.value),i(t.total.value),c(function(t,l,s){t=Number(t),l=Number(l),s=Number(s);var a=[];for(let e=1;e<=l;e++){var n=t-e;0<n&&a.unshift(n)}var i=[];for(let e=1;e<=l+(l-a.length);e++){var o=t+e;o<=s&&i.push(o)}if(i.length<l){var c=a.length;for(let e=1;e<=l-i.length;e++){var r=t-c-e;0<r&&a.unshift(r)}}return[...a,t,...i]}(e.value,t.page.value,Math.ceil(n.value/s.value))),t["show-sis"]&&p(t["show-sis"].value),1<e.value?v(!0):v(!1),e.value<Math.ceil(n.value/s.value)?u(!0):u(!1),t.btn&&m(t.btn.value),t["show-most"]&&f(t["show-most"].value),h.value&&!o.value.includes(1)&&c([1,...o.value]),h.value&&!o.value.includes(Math.ceil(n.value/s.value))&&c([...o.value,Math.ceil(n.value/s.value)])},[t.ps,t.pi,t.total,t.btn,t.page,t["show-most"],t["show-sis"]]),{pi:e,setPi:l,ps:s,setPs:a,total:n,page:o,style:t.style,canNext:r,canPrev:d,changePage:function(e){t.change(e)},showBtn:g,prev:function(){1<e.value&&t.change(e.value-1)},next:function(){e.value<Math.ceil(n.value/s.value)&&t.change(e.value+1)}}}},v,{name:"sugar-upload",render:`<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" instance="fileRef" type="file"/>
           </div>`,bulk(t){const l=g();return{fileInput:function(e){t.change(e.target.files),l.value.value=""},fileRef:l,uploadFile:function(){l.value.click()}}}},{fun:"showToast",bulk(e,t=2e3,l=""){let s=document.createElement("div"),a=(document.body.appendChild(s),m({render:'<div class="sugar-toast" :style="style">{{text}}</div>',bulk(){return{text:e,style:l}}}));a.mount(s),setTimeout(()=>{a=null,s.remove(),s=null},t)}},{name:"sugar-message",render:"",bulk(e){return{}}},{fun:"showMessageBox",bulk(s={title:"提示",content:"这是一条提示的内容",confirmText:"确认",cancelText:"取消",confirm:()=>{},cancel:()=>{}}){let a=document.createElement("div"),n=(document.body.appendChild(a),m({render:`<sugar-dialog :model="show" @close="cancel">
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
                </sugar-dialog>`,bulk(){var e;const[t,l]=h(!0);return f(()=>{console.log(s),l(!0)}),{title:null!=(e=s.title)?e:"提示",content:null!=(e=s.content)?e:"",show:t,cancel:function(){s.cancel(),l(!1),setTimeout(()=>{n=null,a.remove(),a=null},300)},confirm:function(){s.confirm(),l(!1),setTimeout(()=>{n=null,a.remove(),a=null},300)},confirmText:null!=(e=s.confirmText)?e:"确定",cancelText:null!=(e=s.cancelText)?e:"取消"}}}));n.install([t]),n.mount(a)}},{name:"sugar-back-top",render:`<div class="sugar-back-top" @click="goTop" :style="scale">
<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M832 165.76H192c-26.24 0-48 21.76-48 48s21.76 48 48 48h640c26.24 0 48-21.76 48-48s-21.76-48-48-48zM551.04 376.96A58.688 58.688 0 0 0 512 360.32c-12.8 0-29.44 7.04-38.4 16L254.08 595.84c-18.56 18.56-18.56 49.28 0 67.84s49.28 18.56 67.84 0l142.08-142.08v348.16c0 26.24 21.76 48 48 48s48-21.76 48-48V521.6l142.08 142.08c9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08c18.56-18.56 18.56-49.28 0-67.84L551.04 376.96z" p-id="2865" fill="#ffffff"></path></svg>
</div>`,bulk(){const[e,t]=p("");return b(()=>{window.addEventListener("scroll",()=>{400<window.scrollY?t("transform:scale(1)"):t("")})}),{goTop:function(){window.scrollTo({top:0,behavior:"smooth"})},scale:e}}},{name:"sugar-swiper",render:`<div class="sugar-swiper" instance="swiper">
                  <div class="sugar-swiper-wrapper" :style="style">
                        <slot name="default"></slot>
                  </div>
          </div>`,bulk(){const[e,t]=k(""),s=S(),[l,a]=k(""),[n,i]=k("translateX(0)");let o=null,c=0;const[r,u]=k("transform 0.3s"),d=(y(()=>{T(()=>{a(s.value.clientWidth)}),setInterval(()=>{u("transform 0.3s"),c!==s.value.children[0].children.length-1||o?c===s.value.children[0].children.length-1?(o=v(),u("none"),c=0,i(`translateX(-${l.value*c}px)`),T(()=>{u("transform 0.3s"),c=1,i(`translateX(-${l.value*c}px)`)})):c+=1:(o=d(),c+=1,setTimeout(()=>{u("none"),c=0,i(`translateX(-${l.value*c}px)`)},300)),i(`translateX(-${l.value*c}px)`)},2e3)}),()=>{var e,t=s.value.children[0];if(0<t.children.length)return e=t.children[0].cloneNode(!0),t.appendChild(e),e}),v=()=>{var e,t,l=s.value.children[0];if(0<l.children.length)return e=l.children[0].cloneNode(!0),t=l.children[l.children.length-1],l.replaceChild(e,t),e};return M(()=>{t(`width:${l.value*s.value.children[0].children.length}px;transform:${n.value};transition: ${r.value};`)},[l,n]),{style:e,swiper:s}}},{name:"sugar-swiper-item",render:`<div class="sugar-swiper-item" :style="'width:'+width" instance="swiper">
                <slot name="default"></slot>
          </div>`,bulk(){const[e,t]=_(""),l=U();return R(()=>{A(()=>{t(l.value.clientWidth+"px")})}),{width:e,swiper:l}}}];"undefined"!=typeof window&&(window.sugarUI=L),e.sugarUI=L});
//# sourceMappingURL=sugar-ui.js.map
