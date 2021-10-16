function prepareTag(tagName, parentNode) {
    if (!document.getElementsByTagName(tagName)[0]) {
        let elem = document.createElement(tagName);
        document.getElementsByTagName(parentNode)[0].appendChild(elem);
    }
}

export function prepareStructure() {
    prepareTag('title', 'head');
    prepareTag('header', 'body');
    prepareTag('footer', 'body');
}

function toRusString(date) {
    let firstPart = new Intl.DateTimeFormat(
        'ru-RU', { day: 'numeric', month: 'long' }
    ).format(date);
    return firstPart + ' ' + date.getFullYear() + ' года';
}

export function prepareNewsPage() {
    prepareStructure();
    let date = new Date(document.getElementsByTagName('header')[0].innerHTML);
    document.getElementsByTagName('title')[0].innerText = new Intl.DateTimeFormat(
        'ru-RU', { dateStyle: 'short' }
    ).format(date);
    document.getElementsByTagName('header')[0].outerHTML = `
    <header class="header">
        <h1 class="date">${ toRusString(date) }</h1>
        <div class="dayofweek">${ new Intl.DateTimeFormat('ru-RU', { weekday: 'long'}).format(date) }</div>
    </header>`;
    document.getElementsByTagName('footer')[0].outerHTML = `<footer class="footer">
    <p class="footer-links">
        <a href="daybyday.html" class="footer-link">День за днём</a>
    </p>
    <p class="footer-credits">${ document.getElementsByTagName('footer')[0].innerHTML }</p>
    </footer>`;
}

export function switchOff(id) {
    document.getElementById(id).style.display = 'none';
    document.getElementById(id).innerText = '';
}