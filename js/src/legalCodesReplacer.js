import LegalNotes from "./legalNotes";

export default class LegalCodesReplacer {
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
    addNotesToFooter() {
        document.querySelector('.footer').insertAdjacentHTML(
            'beforeend',
            '<section class="footer-notes"></section>'
        );
        for (let note of this.footnotes) {
            document.querySelector('.footer-notes').insertAdjacentHTML('beforeend', note);
        }
    }
}