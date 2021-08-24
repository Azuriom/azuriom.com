window.Popper = require('@popperjs/core');
window.bootstrap = require('bootstrap');
const Typed = require('typed.js');

document.querySelectorAll('.azuriom-last-version').forEach(function (el) {
    fetch('https://api.github.com/repos/Azuriom/Azuriom/releases/latest')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            const version = json['tag_name'].replace('v', '');
            el.innerHTML = `Azuriom v${version}`;
        });
});

document.querySelectorAll('[data-typed]').forEach(function (el) {
    el.innerText = '';

    new Typed(el, {
        strings: el.dataset['typed'].split('|'),
        typeSpeed: 100,
        backSpeed: 25,
        loop: true,
        autoInsertCss: false,
    });
});
