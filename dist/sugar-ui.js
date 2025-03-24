!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Sugar={})}(this,function(e){"use strict";const{useEffect:n,useState:i}=SUGAR,t={name:"sugar-dialog",render:`<div>
        <div class="sugar-dialog-mode" :style="'opacity:'+opacity" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,bulk(e){const[t,a]=i(!1),[l,s]=i(0);return n(()=>{e.model.value?(a(!0),setTimeout(()=>{s(1)},50)):(s(0),setTimeout(()=>{e.model.value||a(!1)},300))},[e.model],!0),{show:t,close:function(){e.close()},opacity:l}}},s=SUGAR["useState"];const a=SUGAR["useState"],{useEffect:o,useState:c,onMounted:u}=SUGAR,{useEffect:w,useState:b}=SUGAR;const l={let:"transform: rotate(180deg);",right:"transform: rotate(0deg);",top:"transform: rotate(90deg);",bottom:"transform: rotate(-90deg);"},{useEffect:r,useState:v}=SUGAR;var d={name:"sugar-text",render:`<div :class="'sugar-text ' + (open ? '':'sugar-text__ellipsis')" :style="style">
                <slot name="default"></slot>
                <div s-if="arrow" class="sugar-arrow" @click="click">
                  <div :class="open ? 'open':''">
                    ${`<svg style="${l.bottom}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`}
                  </div>
                </div>
           </div>`,bulk(e){const[t,a]=v(""),[l,s]=v(!1),[n,i]=v(!1);return r(()=>{a(e.style.value),0<e.rows.value&&a(e.style.value+";"+`-webkit-line-clamp: ${e.rows.value};`),e.arrow&&s(e.arrow.value)},[e.style,e.rows,e.arrow],!0),{style:t,rows:e.rows,arrow:l,open:n,click:function(){i(!n.value)}}}};const g=SUGAR["instance"],{makeSugar:m,useState:f,onMounted:h}=SUGAR;const p=[t,{name:"sugar-button",render:`<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,bulk(t){const[a,l]=s(0);return{click:function(){var e;l(a.value+1),null!=(e=t.click)&&e.call(t)},ctx:t,text:a}}},{name:"sugar-image",render:`<div class="sugar-image-container">
                <img :src="ctx.src"/>
          </div>`,bulk(e){var[t,,]=a("sugar-image-container");return{ctx:e,className:t}}},{name:"sugar-checkbox",render:`
    <div class="sugar-checkbox-container" :style="style" @click.self="click">
     <div class="sugar-checked" s-if="checked" ></div>
    </div>
  `,bulk(e){u(()=>{console.log(e)});const[t,a]=c(!1);var[l,,]=c("");return o(()=>{a(e.model.value)},[e.model],!0),{checked:t,ctx:e,style:l,click:function(){console.log(e)}}}},{name:"sugar-pagination",render:`
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
  `,bulk(t){const[e,a]=b(1),[l,s]=b(20),[n,i]=b(0),[o,c]=b([1]),[u,r]=b(!1),[v,d]=b(!1),[g,m]=b(!1),[f,h]=b(!1),[,p]=b(!1);return w(()=>{s(t.ps.value),a(t.pi.value),i(t.total.value),c(function(t,a,l){t=Number(t),a=Number(a),l=Number(l);var s=[];for(let e=1;e<=a;e++){var n=t-e;0<n&&s.unshift(n)}var i=[];for(let e=1;e<=a+(a-s.length);e++){var o=t+e;o<=l&&i.push(o)}if(i.length<a){var c=s.length;for(let e=1;e<=a-i.length;e++){var u=t-c-e;0<u&&s.unshift(u)}}return[...s,t,...i]}(e.value,t.page.value,Math.ceil(n.value/l.value))),t["show-sis"]&&p(t["show-sis"].value),1<e.value?d(!0):d(!1),e.value<Math.ceil(n.value/l.value)?r(!0):r(!1),t.btn&&m(t.btn.value),t["show-most"]&&h(t["show-most"].value),f.value&&!o.value.includes(1)&&c([1,...o.value]),f.value&&!o.value.includes(Math.ceil(n.value/l.value))&&c([...o.value,Math.ceil(n.value/l.value)])},[t.ps,t.pi,t.total,t.btn,t.page,t["show-most"],t["show-sis"]]),{pi:e,setPi:a,ps:l,setPs:s,total:n,page:o,style:t.style,canNext:u,canPrev:v,changePage:function(e){t.change(e)},showBtn:g,prev:function(){1<e.value&&t.change(e.value-1)},next:function(){e.value<Math.ceil(n.value/l.value)&&t.change(e.value+1)}}}},d,{name:"sugar-upload",render:`<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" instance="fileRef" type="file"/>
           </div>`,bulk(t){const a=g();return{fileInput:function(e){t.change(e.target.files),a.value.value=""},fileRef:a,uploadFile:function(){a.value.click()}}}},{fun:"showToast",bulk(e,t=2e3,a=""){let l=document.createElement("div"),s=(document.body.appendChild(l),m({render:'<div class="sugar-toast" :style="style">{{text}}</div>',bulk(){return{text:e,style:a}}}));s.mount(l),setTimeout(()=>{s=null,l.remove(),l=null},t)}},{name:"sugar-message",render:"",bulk(e){return{}}},{fun:"showMessageBox",bulk(l={title:"提示",content:"这是一条提示的内容",confirmText:"确认",cancelText:"取消",confirm:()=>{},cancel:()=>{}}){let s=document.createElement("div"),n=(document.body.appendChild(s),m({render:`<sugar-dialog :model="show" @close="cancel">
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
                </sugar-dialog>`,bulk(){var e;const[t,a]=f(!0);return h(()=>{console.log(l),a(!0)}),{title:null!=(e=l.title)?e:"提示",content:null!=(e=l.content)?e:"",show:t,cancel:function(){l.cancel(),a(!1),setTimeout(()=>{n=null,s.remove(),s=null},300)},confirm:function(){l.confirm(),a(!1),setTimeout(()=>{n=null,s.remove(),s=null},300)},confirmText:null!=(e=l.confirmText)?e:"确定",cancelText:null!=(e=l.cancelText)?e:"取消"}}}));n.install([t]),n.mount(s)}}];"undefined"!=typeof window&&(window.sugarUI=p),e.sugarUI=p});
//# sourceMappingURL=sugar-ui.js.map
