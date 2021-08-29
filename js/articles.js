const title = document.getElementsByTagName('title')[0];
const header = document.getElementsByTagName('header')[0];
const footer = document.getElementsByTagName('footer')[0];

class LegalNotes {
    constructor() {
        this.notes = [
            'Организация признана в России террористической, запрещена на территории РФ.',
            'Организация признана в России экстремистской, запрещена на территории РФ.',
            'Организация, ранее выполнявшая функции иностранного агента, признана в России экстремистской, запрещена на территории РФ.',
            'Организация или физическое лицо, выполняющее функции иностранного агента.'
        ];
        this.codes = ['terrorist', 't', 'extremist', 'e', 'exino', 'ei', 'ino', 'i'];
    }
    numeric(code) {
        switch (code) {
            case 'terrorist':
            case 't':
                return 1;
            case 'extremist':
            case 'e':
                return 2;
            case 'exino':
            case 'ei':
                return 3;
            case 'ino':
            case 'i':
                return 4;
        }
    }
    intextNote(code) {
        let numcode = this.numeric(code);
        if (numcode) return `<sup>${ numcode }</sup>`;
        return '';
    }
    footerNote(code) {
        let numcode = this.numeric(code);
        if (numcode)
            return `<p class="footer-notes"><sup>${ numcode }</sup> ${ this.notes[numcode - 1] }</p>`;
    }
    addFooterNote(code) {
        document.getElementsByTagName('footer')[0].insertAdjacentHTML('beforeend', this.footerNote(code));
    }
    replaceCodes(stringToReplace) {
        let result = stringToReplace;
        for (let code of this.codes) {
            let regExp = new RegExp(`\{${ code }\}`, 'g');
            if (result.search(regExp) > 0) {
                this.addFooterNote(code);
                result = result.replace(regExp, this.intextNote(code));
            }
        }
        return result;
    }
}

Date.prototype.toRusString = function() {
    let firstPart = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(this);
    return firstPart + ' ' + this.getFullYear() + ' года';
}

function simpleFooter(text) {
    return `<footer class="footer">
    <p class="footer-links">
        <a href="daybyday.html" class="footer-link">День за днём</a>
    </p>
    <p class="footer-credits">${ text }</p>
    </footer>`;
}

function simpleHeader(jsonDate) {
    let date = new Date(jsonDate);
    return `<header class="header">
    <h1 class="date">${ date.toRusString() }</h1>
    <div class="dayofweek">${ new Intl.DateTimeFormat('ru-RU', { weekday: 'long'}).format(date) }</div>
</header>`
}

class ArticleBlock {
    constructor() {
        this.block = document.getElementById('md');
    }
    extractData() {
        let data = this.block.innerHTML;
        data = data.replace(/\.\.\./g, '…');
        data = data.replace(/"([^"]+)"/g, '«$1»');
        data = data.replace(/(?<!»,) - /g, ' — ');
        return data;
    }
    prepareArticles(data) {
        function articleString(articleArray) {
            return `<article class="message">${articleArray.join('')}</article>`;
        }

        let strings = data.split(/\n/g).filter(function(value) {
            return value != '';
        });
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
    convert() {
        if (!this.block) return;
        let output = document.createElement('section');
        let articles = this.prepareArticles(
            new LegalNotes().replaceCodes(this.extractData())
        );
        output.innerHTML = articles.join('');
        this.block.insertAdjacentElement('beforebegin', output);
        this.block.style.display = 'none';
    }
}

let date = header.innerHTML;
title.innerText = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short' }).format(new Date(date));
header.outerHTML = simpleHeader(date);
footer.outerHTML = simpleFooter(footer.innerHTML);
new ArticleBlock().convert();