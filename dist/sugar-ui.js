!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Sugar={})}(this,function(e){"use strict";const{useEffect:n,useState:o}=SUGAR,t={name:"sugar-dialog",render:`<div>
        <div class="sugar-dialog-mode" :style="'opacity:'+opacity" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,bulk(e){const[t,s]=o(!1),[l,a]=o(0);return n(()=>{e.model.value?(s(!0),setTimeout(()=>{a(1)},50)):(a(0),setTimeout(()=>{e.model.value||s(!1)},300))},[e.model],!0),{show:t,close:function(){e.close()},opacity:l}}},a=SUGAR["useState"];const s=SUGAR["useState"],{useEffect:i,useState:c,onMounted:u}=SUGAR,{useEffect:w,useState:b}=SUGAR;const l={let:"transform: rotate(180deg);",right:"transform: rotate(0deg);",top:"transform: rotate(90deg);",bottom:"transform: rotate(-90deg);"},{useEffect:r,useState:v}=SUGAR;var d={name:"sugar-text",render:`<div :class="'sugar-text ' + (open ? '':'sugar-text__ellipsis')" :style="style">
                <slot name="default"></slot>
                <div s-if="arrow" class="sugar-arrow" @click="click">
                  <div :class="open ? 'open':''">
                    ${`<svg style="${l.bottom}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`}
                  </div>
                </div>
           </div>`,bulk(e){const[t,s]=v(""),[l,a]=v(!1),[n,o]=v(!1);return r(()=>{s(e.style.value),0<e.rows.value&&s(e.style.value+";"+`-webkit-line-clamp: ${e.rows.value};`),e.arrow&&a(e.arrow.value)},[e.style,e.rows,e.arrow],!0),{style:t,rows:e.rows,arrow:l,open:n,click:function(){o(!n.value)}}}};const g=SUGAR["instance"],{makeSugar:m,useState:f,onMounted:h}=SUGAR;const{useState:p,onMounted:x}=SUGAR,k=[t,{name:"sugar-button",render:`<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,bulk(t){const[s,l]=a(0);return{click:function(){var e;l(s.value+1),null!=(e=t.click)&&e.call(t)},ctx:t,text:s}}},{name:"sugar-image",render:`<div class="sugar-image-container">
                <img :src="ctx.src"/>
          </div>`,bulk(e){var[t,,]=s("sugar-image-container");return{ctx:e,className:t}}},{name:"sugar-checkbox",render:`
    <div class="sugar-checkbox-container" :style="style" @click.self="click">
     <div class="sugar-checked" s-if="checked" ></div>
    </div>
  `,bulk(e){u(()=>{console.log(e)});const[t,s]=c(!1);var[l,,]=c("");return i(()=>{s(e.model.value)},[e.model],!0),{checked:t,ctx:e,style:l,click:function(){console.log(e)}}}},{name:"sugar-pagination",render:`
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
  `,bulk(t){const[e,s]=b(1),[l,a]=b(20),[n,o]=b(0),[i,c]=b([1]),[u,r]=b(!1),[v,d]=b(!1),[g,m]=b(!1),[f,h]=b(!1),[,p]=b(!1);return w(()=>{a(t.ps.value),s(t.pi.value),o(t.total.value),c(function(t,s,l){t=Number(t),s=Number(s),l=Number(l);var a=[];for(let e=1;e<=s;e++){var n=t-e;0<n&&a.unshift(n)}var o=[];for(let e=1;e<=s+(s-a.length);e++){var i=t+e;i<=l&&o.push(i)}if(o.length<s){var c=a.length;for(let e=1;e<=s-o.length;e++){var u=t-c-e;0<u&&a.unshift(u)}}return[...a,t,...o]}(e.value,t.page.value,Math.ceil(n.value/l.value))),t["show-sis"]&&p(t["show-sis"].value),1<e.value?d(!0):d(!1),e.value<Math.ceil(n.value/l.value)?r(!0):r(!1),t.btn&&m(t.btn.value),t["show-most"]&&h(t["show-most"].value),f.value&&!i.value.includes(1)&&c([1,...i.value]),f.value&&!i.value.includes(Math.ceil(n.value/l.value))&&c([...i.value,Math.ceil(n.value/l.value)])},[t.ps,t.pi,t.total,t.btn,t.page,t["show-most"],t["show-sis"]]),{pi:e,setPi:s,ps:l,setPs:a,total:n,page:i,style:t.style,canNext:u,canPrev:v,changePage:function(e){t.change(e)},showBtn:g,prev:function(){1<e.value&&t.change(e.value-1)},next:function(){e.value<Math.ceil(n.value/l.value)&&t.change(e.value+1)}}}},d,{name:"sugar-upload",render:`<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" instance="fileRef" type="file"/>
           </div>`,bulk(t){const s=g();return{fileInput:function(e){t.change(e.target.files),s.value.value=""},fileRef:s,uploadFile:function(){s.value.click()}}}},{fun:"showToast",bulk(e,t=2e3,s=""){let l=document.createElement("div"),a=(document.body.appendChild(l),m({render:'<div class="sugar-toast" :style="style">{{text}}</div>',bulk(){return{text:e,style:s}}}));a.mount(l),setTimeout(()=>{a=null,l.remove(),l=null},t)}},{name:"sugar-message",render:"",bulk(e){return{}}},{fun:"showMessageBox",bulk(l={title:"提示",content:"这是一条提示的内容",confirmText:"确认",cancelText:"取消",confirm:()=>{},cancel:()=>{}}){let a=document.createElement("div"),n=(document.body.appendChild(a),m({render:`<sugar-dialog :model="show" @close="cancel">
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
                </sugar-dialog>`,bulk(){var e;const[t,s]=f(!0);return h(()=>{console.log(l),s(!0)}),{title:null!=(e=l.title)?e:"提示",content:null!=(e=l.content)?e:"",show:t,cancel:function(){l.cancel(),s(!1),setTimeout(()=>{n=null,a.remove(),a=null},300)},confirm:function(){l.confirm(),s(!1),setTimeout(()=>{n=null,a.remove(),a=null},300)},confirmText:null!=(e=l.confirmText)?e:"确定",cancelText:null!=(e=l.cancelText)?e:"取消"}}}));n.install([t]),n.mount(a)}},{name:"sugar-back-top",render:`<div class="sugar-back-top" @click="goTop" :style="scale">
<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M832 165.76H192c-26.24 0-48 21.76-48 48s21.76 48 48 48h640c26.24 0 48-21.76 48-48s-21.76-48-48-48zM551.04 376.96A58.688 58.688 0 0 0 512 360.32c-12.8 0-29.44 7.04-38.4 16L254.08 595.84c-18.56 18.56-18.56 49.28 0 67.84s49.28 18.56 67.84 0l142.08-142.08v348.16c0 26.24 21.76 48 48 48s48-21.76 48-48V521.6l142.08 142.08c9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08c18.56-18.56 18.56-49.28 0-67.84L551.04 376.96z" p-id="2865" fill="#ffffff"></path></svg>
</div>`,bulk(){const[e,t]=p("");return x(()=>{window.addEventListener("scroll",()=>{400<window.scrollY?t("transform:scale(1)"):t("")})}),{goTop:function(){window.scrollTo({top:0,behavior:"smooth"})},scale:e}}}];"undefined"!=typeof window&&(window.sugarUI=k),e.sugarUI=k});
//# sourceMappingURL=sugar-ui.js.map
