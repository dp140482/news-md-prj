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
            return `<p class="footer-note"><sup>${ numcode }</sup> ${ this.notes[numcode - 1] }</p>`;
    }
}

class LegalCodesReplacer {
    constructor() {
        this.footnotes = [];
        this.result = '';
        this.legalNotes = new LegalNotes();
    }
    replace(stringToReplace) {
        this.result = stringToReplace;
        for (let code of this.legalNotes.codes) {
            let regExp = new RegExp(`\{${ code }\}`, 'g');
            if (this.result.search(regExp) > 0) {
                this.footnotes.push(this.legalNotes.footerNote(code));
                this.result = this.result.replace(regExp, this.legalNotes.intextNote(code));
            }
        }
    }
    clear() {
        this.footnotes = [];
        this.result = '';
    }
    addNotesTo(footerElement) {
        footerElement.insertAdjacentHTML('beforeend', '<section class="footer-notes">');
        for (let note of this.footnotes)
            footerElement.insertAdjacentHTML('beforeend', note);
        footerElement.insertAdjacentHTML('beforeend', '</section>');
    }
}

function extractDataFrom(TextOfBlock) {
    let data = TextOfBlock;
    data = data.replace(/\.\.\./g, '…');
    data = data.replace(/"([^"]+)"/g, '«$1»');
    data = data.replace(/(?<!»,) - /g, ' — ');
    return data;
}

Date.prototype.toRusString = function() {
    let firstPart = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(this);
    return firstPart + ' ' + this.getFullYear() + ' года';
}

class DocElements {
    constructor() {
        this.title = document.getElementsByTagName('title')[0];
        this.block = document.getElementById('md');
        this.LCR = new LegalCodesReplacer();
    }
    prepareStructure() {
        this.header = document.getElementsByTagName('header')[0];
        this.footer = document.getElementsByTagName('footer')[0];
        let date = new Date(this.header.innerHTML);
        this.title.innerText = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short' }).format(new Date(date));
        this.header.outerHTML = `
        <header class="header">
            <h1 class="date">${ date.toRusString() }</h1>
            <div class="dayofweek">${ new Intl.DateTimeFormat('ru-RU', { weekday: 'long'}).format(date) }</div>
        </header>`;
        this.footer.outerHTML = `<footer class="footer">
        <p class="footer-links">
            <a href="daybyday.html" class="footer-link">День за днём</a>
        </p>
        <p class="footer-credits">${ this.footer.innerHTML }</p>
        </footer>`;
    }
    prepareData() {
        this.data = extractDataFrom(this.block.innerHTML);
        this.LCR.replace(this.data);
        this.block.style.display = 'none';
        this.block.innerText = '';
        this.data = this.LCR.result;
    }
    dropFootnotes() {
        this.LCR.addNotesTo(this.footer);
        this.LCR.clear();
        this.LCR = null;
    }
    prepareStrings() {
        this.strings = this.data.split(/\n/g).filter(function(value) {
            return value != '';
        });
        this.data = undefined;
    }
    pushArticle() {
        if (this.article.length > 0) {
            this.articles.push(`<article class="message">${this.article.join('')}</article>`);
            this.article = [];
        }
    }
    parseStrings() {
        this.articles = [];
        this.article = [];
        let afterHeadline = false;
        let string;
        while (string = this.strings.shift()) {
            if (string.startsWith('#\{begin\}')) {
                this.article.push(string.replace('#\{begin\}', '<div class="messages-closed"><button class="btn-open-close">▲▼</button>'));
            } else if (string.startsWith('#\{end\}')) {
                this.article.push(string.replace('#\{end\}', '</div>'));
                this.pushArticle();
            } else if (string.startsWith('#!')) {
                this.article.push('<div class="short">');
                this.article.push(string.replace('#!', ''));
                this.article.push('</div>');
                this.pushArticle();
            } else if (string.startsWith('##')) {
                let s = string.replace('##', '<div class="message-tags">') + '</div>';
                if (!afterHeadline && this.article.length !== 0) {
                    this.pushArticle();
                }
                this.article.push(s);
                afterHeadline = false;
            } else if (string.startsWith('#')) {
                let s = string.replace('#', '<h2 class="message-header">') + '</h2>';
                if (this.article.length !== 0) {
                    this.pushArticle();
                }
                this.article.push(s);
                afterHeadline = true;
            } else {
                this.article.push(`<p>${ string }</p>`);
            }
        }
        this.pushArticle();
    }
    show() {
        let output = document.createElement('section');
        output.innerHTML = this.articles.join('');
        this.block.insertAdjacentElement('beforebegin', output);
        this.block.style.display = 'none';
    }
    do() {
        if (!this.block) return;
        this.prepareStructure();
        this.prepareData();
        this.dropFootnotes();
        this.prepareStrings();
        this.parseStrings();
        this.show();
    }
}

new DocElements().do();
document.querySelectorAll('.btn-open-close').forEach(element => {
    element.addEventListener('click', event => {
        element.parentNode.classList.toggle('messages-closed');
        element.parentNode.classList.toggle('messages-open');
    });
});