import LegalCodesReplacer from "./legalCodesReplacer.js";
import { extractDataFrom } from './functions.js';
import { prepareNewsPage, switchOff } from './workWithDoc.js';

class DocElements {
    constructor() {
        this.LCR = new LegalCodesReplacer();
    }
    prepareData() {
        this.data = extractDataFrom(document.getElementById('md').innerHTML);
        this.LCR.replace(this.data);
        switchOff('md');
        this.data = this.LCR.result;
    }
    dropFootnotes() {
        this.LCR.addNotesToFooter();
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
        let string;
        while (string = this.strings.shift()) {
            if (string.startsWith('###')) {
                this.article.push(string.replace('###', '<h3 class="message-header">') + '</h3>');
            } else if (string.startsWith('##')) {
                let s = string.replace('##', '<div class="message-tags">') + '</div>';
                if (this.article.length !== 0) {
                    this.pushArticle();
                }
                this.article.push(s);
            } else if (string.startsWith('#')) {
                let s = string.replace('#', '<h2 class="block-header">') + '</h2>';
                this.pushArticle();
                this.articles.push(s);
            } else {
                this.article.push(`<p>${ string }</p>`);
            }
        }
        this.pushArticle();
    }
    show() {
        let output = document.createElement('section');
        output.innerHTML = this.articles.join('');
        document.getElementById('md').insertAdjacentElement('beforebegin', output);
        document.getElementById('md').style.display = 'none';
    }
}

export function execute() {
    if (!document.getElementById('md')) return;
    prepareNewsPage();
    let DE = new DocElements();
    DE.prepareData();
    DE.dropFootnotes();
    DE.prepareStrings();
    DE.parseStrings();
    DE.show();
}

export function setListeners() {
    document.querySelectorAll('.btn-open-close').forEach(element => {
        element.addEventListener('click', () => {
            element.parentNode.classList.toggle('messages-closed');
            element.parentNode.classList.toggle('messages-open');
        });
    });
}