export function replaceAt(str, index, replacer) {
    return str.slice(0, index) + replacer + str.slice(index + 1, str.length);
}

export function extractDataFrom(TextOfBlock) {
    let data = TextOfBlock;
    data = data.replace(/\.\.\./g, '…');
    data = data.replace(/(^)\x22(\s)/g, '$1»$2');
    data = data.replace(/(^|\s|\()"/g, "$1«");
    data = data.replace(/"(\;|\!|\?|\:|\.|\,|$|\)|\s)/g, "»$1");
    data = data.replace(/(?<!»,) - /g, ' — ');
    return data;
}