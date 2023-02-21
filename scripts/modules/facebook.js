chrome.runtime.onMessage.addListener(async function (Message) {
    console.log(Message)
    if (Message.Message === 'collect') {
        collect();
    }
})

function collect() {

    let data = {}
    data.author = document.querySelector('h2 strong span').innerText;
    let textDom = document.querySelector('div[data-ad-preview="message"] .xu06os2.x1ok221b span').innerHTML;
    let htmlTagReg = /<(\/)?[^>].*?>/g;
    data.title = textDom.replace(htmlTagReg, '');
    let imgs = document.querySelectorAll('div[role="article"] div.x1n2onr6 div.x1n2onr6 img' + '.x1ey2m1c xds687c x5yr21d x10l6tqk x17qophe x13vifvy xh8yej3'.replaceAll(' ', '.'))
    data.pics = Array.from(imgs).map(r => {
        return r.src
    })
    let commentDom = document.querySelectorAll('div.x193iq5w.xw7yly9.xvue9z.xq1tmr.x1ceravr div.x1r8uery.x1iyjqo2.x6ikm8r.x10wlt62.x1pi30zi')
    data.comment = Array.from(commentDom).map(r=>{

        let temp = {};
        temp.title = r.querySelector('span.xt0psk2').innerText;

    })
    console.log(data);

}