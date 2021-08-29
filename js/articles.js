function createSimpleFooter() {
    const footerPlace = document.getElementsByTagName('footer')[0];
    const footerString = `Файл составлен на основе материалов новостного агрегатора
    <a href="https://yandex.ru/news" class="footer-credits-link">Яндекс.Новости</a>
    и статей по ссылкам из этих материалов.`;

    const footerTags = footerPlace.innerText;

    footerPlace.innerHTML = `<footer class="footer">
    <p class="footer-links">
        <a href="daybyday.html" class="footer-link">День за днём</a>
    </p>
    <p class="footer-credits">${ footerString }</p>
    </footer>`;
}

function addFooterNote(num, text) {
    const place = document.getElementsByTagName('footer')[0];
    place.insertAdjacentHTML('beforeend', `<p class="footer-notes"><sup>${ num }</sup>${ text }</p>`);
}

createSimpleFooter();

function extractData(source) {
    let data = source.innerHTML;
    data = data.replace(/\.\.\./g, '…');
    data = data.replace(/"([^"]+)"/g, '«$1»');
    data = data.replace(/(?<!»,) - /g, ' — ');
    return data;
}

function replaceCode(str, code, num, text) {
    let regExp = new RegExp(`\{${ code }\}`, 'g');
    if (str.search(regExp) > 0) {
        addFooterNote(num, text);
        str.replace(regExp, `<sup>${ code }</sup>`);
    }
}

function notesInData(data) {
    let prepared = data;
    replaceCode(
        prepared, 'terrorist', 1,
        'Организация признана в России террористической, запрещена на территории РФ.'
    );
    replaceCode(
        prepared, 'extremist', 2,
        'Организация признана в России экстремистской, запрещена на территории РФ.'
    );
    replaceCode(
        prepared, 'exino', 3,
        `Организация, ранее выполнявшая функции иностранного агента, признана
        в России экстремистской, запрещена на территории РФ.`
    );
    replaceCode(
        prepared, 'ino', 4,
        `Организация или физическое лицо, выполняющее функции иностранного агента.`
    );
    return prepared;
}

function articleString(articleArray) {
    return `<article class="message">${articleArray.join('')}</article>`;
}

function prepareArticles(data) {
    let strings = notesInData(data).split(/\n/g).filter(value => { value != '' });
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

function convert(artBlock) {
    let output = document.createElement('section');
    let articles = prepareArticles(extractData(artBlock));
    output.innerHTML = articles.join('');
    artBlock.insertAdjacentElement('beforebegin', output);
    // artBlock.innerText = '';
}

let artBlock = document.getElementById('articles-compact');
if (artBlock !== null)
    convert(artBlock);