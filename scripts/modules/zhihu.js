const form = document.createElement('form');
form.setAttribute('action', 'http://twtest.anyelse.com/qa')
form.setAttribute('method', 'post')
form.setAttribute('style', 'position: fixed;top:10px;left:10px;z-index:999;background:#fff;border:1px solid #ccc')
document.body.appendChild(form);
const btn = document.createElement('button');
btn.setAttribute('style', 'width: 100px;height: 40px;')
btn.setAttribute('type', 'submit')
const textarea = document.createElement('textarea');
document.querySelector('.RichText-LinkCardContainer')?.remove()
textarea.value = document.querySelector('.QuestionRichText--expandable').innerHTML
textarea.name = 'content'
const title = document.createElement('input')
title.value = document.querySelector('.QuestionHeader-title').innerText
title.name = 'title'
form.appendChild(title)
form.appendChild(textarea)
btn.innerText = '提交'
form.appendChild(btn);