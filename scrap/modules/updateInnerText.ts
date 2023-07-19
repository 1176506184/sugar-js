function updateInnerText(text: string) {
    text = text.replace(/({{)\Ss*(}})/ig,"");
    return text;
}

export {updateInnerText}