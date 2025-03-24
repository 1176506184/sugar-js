# sugar-js

This is a library that provides responsive capabilities

## Use
    <div id="app">{{text}}</div>

```js
const { maskSugar, useState } = SUGAR;
const app = makeSugar({
    bulk(){
        const [text,setText] = useState("");
        
        return {
            text
        }
    }
})
app.mount('#app')
```

## onMounted
```js
onMounted(()=>{
  setText("update");
})
````

## useEffect
```js
const [text,setText] = useState("");
useEffect(()=>{
  console.log(text.value)
},[text])
onMounted(()=>{
  setText("update");
})
```

## instance
```js
<div instance="divRef"></div>
const divRef = instance();
console.log(divRef.value)
```

## sugar-ui

```js
app.install(sugarUI)
app.mount('#app')
```
## sugar-dialog
```js

<div id="app">
    <sugar-dialog :model="open">
       <div>
         <h1>Hello</h1>
       </div>
    </sugar-dialog>
</div>

const [open,setOpen] = useState(false);
setOpen(true)
```
## sugar-upload
```js
<sugar-upload @change="fileChange(item)">
  <sugar-button>上传</sugar-button>
</sugar-upload>

function fileChange(e) {
     console.log(e);
}
```

## sugar-pagination
```js
<sugar-pagination
            :pi="pi"
            :ps="ps"
            :total="total"
            page="2"
            style="margin-top: 10px"
            @change="changePage"
            :btn="true"
            :show-most="true">
</sugar-pagination>

const [pi, setPi] = useState(0);
const [total, setTotal] = useState(0);
const [ps, setPS] = useState(20);
function changePage(v) {
      setPi(v);
}
````

## sugar-ui-tool
```js
app.$.showToast("Hello");
app.$.showMessageBox({
  title:'Tips',
  content:'this is a tips',
  confirm(){
    
  },
  cancel(){
    
  },
  confirmText:'ok',
  cancelText:'cancel'
});
```