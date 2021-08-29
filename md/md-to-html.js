'use strict';

function extractData(md) {
    let data = md.innerHTML;
    data = data.replace(/\.\.\./g, '…');
    data = data.replace(/"([^"]+)"/g, '«$1»');
    data = data.replace(/(?<!»,) - /g, ' — ');
    return data;
}

function prepareArticles(data) {
    function isNotEmpty(value) {
        return value != '';
    }
    let strings = data.split(/\n/g).filter(isNotEmpty);

    function articleString(articleArray) {
        return `<article class="message">${articleArray.join('')}</article>`;
    }
    let articles = [];
    let article = [];
    let afterHeadline = false;
    for (let i = 0; i < strings.length; i++) {
        if (strings[i].startsWith('##')) {
            let str = strings[i].replace('##', '<div class="message-tags">');
            str += '</div>';
            if (!afterHeadline && article.length !== 0) {
                articles.push(articleString(article));
                article = [];
            }
            article.push(str);
            afterHeadline = false;
        } else if (strings[i].startsWith('#')) {
            let str = strings[i].replace('#', '<h2 class="message-header">');
            str += '</h2>';
            if (article.length !== 0) {
                articles.push(articleString(article));
                article = [];
            }
            article.push(str);
            afterHeadline = true;
        } else {
            article.push(`<p>${strings[i]}</p>`);
            afterHeadline = false;
        }
    }
    articles.push(articleString(article));
    return articles;
}

function prepareNotes(data) {
    function isNotEmpty(value) {
        return value != '';
    }
    let strings = data.split(/\n/g).filter(isNotEmpty);
    for (let i = 0; i < strings.length; i++) {
        strings[i] = `<p>${strings[i]}</p>`;
    }
    return strings;
}

let md = document.getElementById('md');
if (md !== null) {
    let out = document.createElement('section');
    let articles = prepareArticles(extractData(md));

    out.innerHTML = articles.join('');
    md.insertAdjacentElement('beforebegin', out);
    md.innerText = '';
}
md = document.getElementById('nt');
if (md !== null) {
    let out = document.createElement('section');
    out.classList.add('notes');
    let msgs = prepareNotes(extractData(md));
    out.innerHTML = '<h2 class="section-header">Заметки одной строкой<h2>\n' + msgs.join('');
    md.insertAdjacentElement('beforebegin', out);
    md.innerText = '';
}