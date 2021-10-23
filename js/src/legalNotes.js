export default class LegalNotes {
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