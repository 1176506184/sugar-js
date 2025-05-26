window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {
        if (res.data.url.includes("_ajax/fonts/find")) {
            let fontOrigin = JSON.parse(res.data.data.replace(`'"])}while(1);</x>//`, ''))['fontFamilies'][0];
            const font = {
                name:fontOrigin.name,
                src:fontOrigin.fonts[0].files[0].url
            }
        }
    }
})
